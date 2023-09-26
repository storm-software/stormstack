import { ConnectorType, DMMF } from "@prisma/generator-helper";
import {
  kebabCase,
  lowerCaseFirst,
  upperCaseFirst
} from "@stormstack/core-shared-utilities/common/string-fns";
import {
  DataModel,
  DataSource,
  Enum,
  Model,
  isDataModel,
  isDataSource,
  isEnum
} from "@stormstack/tools-forecast-language/ast";
import { getDefaultOutputFolder } from "@stormstack/tools-forecast-schema/plugins/plugin-utils";
import { PrismaModel } from "@stormstack/tools-forecast-schema/plugins/prisma/prisma-builder";
import PrismaSchemaGenerator from "@stormstack/tools-forecast-schema/plugins/prisma/schema-generator";
import {
  AUXILIARY_FIELDS,
  PluginOptions,
  createProject,
  emitProject,
  getDataModels,
  getFileHeader,
  getLiteral,
  resolvePath,
  saveProject
} from "@stormstack/tools-forecast-schema/sdk";
import { promises as fs } from "fs";
import { join } from "path";
import { Project } from "ts-morph";
import Transformer from "./transformer";
import { PostgresqlSchemaGenerator } from "./utils/postgresql.schema-gen";
import removeDir from "./utils/removeDir";
import { SchemaGenerator } from "./utils/schema-gen";
import { SqliteSchemaGenerator } from "./utils/sqlite.schema-gen";

export async function generate(
  model: Model,
  options: PluginOptions,
  dmmf: DMMF.Document
) {
  let output = options.output as string;
  if (!output) {
    const defaultOutputFolder = getDefaultOutputFolder();
    if (defaultOutputFolder) {
      output = join(defaultOutputFolder, "drizzle");
    } else {
      output = "./__generated__/drizzle";
    }
  }
  output = resolvePath(output, options);
  await handleGeneratorOutputValue(output);

  const prismaClientDmmf = dmmf;

  const modelOperations = prismaClientDmmf.mappings.modelOperations;
  const inputObjectTypes = prismaClientDmmf.schema.inputObjectTypes.prisma;
  const outputObjectTypes = prismaClientDmmf.schema.outputObjectTypes.prisma;
  const models: DMMF.Model[] = prismaClientDmmf.datamodel.models;

  const project = createProject();

  // common schemas
  //await generateCommonSchemas(project, output);

  // enums
  await generateEnumSchemas(
    prismaClientDmmf.schema.enumTypes.prisma,
    prismaClientDmmf.schema.enumTypes.model ?? [],
    project,
    model
  );

  const dataSource = model.declarations.find((d): d is DataSource =>
    isDataSource(d)
  );

  const dataSourceProvider = getLiteral<string>(
    dataSource?.fields.find(f => f.name === "provider")?.value
  ) as ConnectorType;

  await generateModelSchemas(project, model, output, dataSourceProvider);

  // create barrel file
  const exports = [
    `export * as schemas from './schemas'`,
    `export * as enums from './enums'`
  ];

  project.createSourceFile(join(output, "index.ts"), exports.join(";\n"), {
    overwrite: true
  });

  // emit
  const shouldCompile = options.compile !== false;
  if (!shouldCompile || options.preserveTsFiles === true) {
    // save ts files
    await saveProject(project);
  }
  if (shouldCompile) {
    await emitProject(project);
  }
}

async function handleGeneratorOutputValue(output: string) {
  // create the output directory and delete contents that might exist from a previous run
  await fs.mkdir(output, { recursive: true });
  const isRemoveContentsOnly = true;
  await removeDir(output, isRemoveContentsOnly);

  Transformer.setOutputPath(output);
}

async function generateEnumSchemas(
  prismaSchemaEnum: DMMF.SchemaEnum[],
  modelSchemaEnum: DMMF.SchemaEnum[],
  project: Project,
  model: Model
) {
  const prisma = new PrismaModel();
  const generator = new PrismaSchemaGenerator();

  const enums = model.declarations.reduce((ret, decl) => {
    if (decl.$type === Enum) {
      ret.push(decl as Enum);
    }

    return ret;
  }, []);
  enums.forEach(e => generator.generateEnum(prisma, e));

  const enumNames = prisma.enums.map(enumItem => enumItem.name);
  Transformer.enumNames = enumNames ?? [];
  const transformer = new Transformer({
    enumTypes: [
      ...prismaSchemaEnum,
      ...modelSchemaEnum,
      ...prisma.enums.map(e => ({
        name: e.name,
        values: e.fields.map(f => f.name)
      }))
    ],
    project,
    storm: model
  });
  await transformer.generateEnumSchemas();
}

async function generateModelSchemas(
  project: Project,
  storm: Model,
  output: string,
  dataSourceProvider: ConnectorType
) {
  const schemaNames: string[] = [];
  for (const dm of getDataModels(storm)) {
    schemaNames.push(
      await generateModelSchema(dm, project, output, dataSourceProvider)
    );
  }

  project.createSourceFile(
    join(output, "schemas", "index.ts"),
    schemaNames.map(name => `export * from './${name}';`).join("\n"),
    { overwrite: true }
  );
}

async function generateModelSchema(
  model: DataModel,
  project: Project,
  output: string,
  dataSourceProvider: ConnectorType
) {
  let generator: SchemaGenerator;
  switch (dataSourceProvider) {
    case "sqlite":
      generator = new SqliteSchemaGenerator();
      break;
    case "postgresql":
      generator = new PostgresqlSchemaGenerator();
      break;
    default:
      throw new Error(
        `Unsupported data source provider: ${dataSourceProvider}`
      );
  }

  const schemaName = `${kebabCase(model.name)}.schema`;
  const sf = project.createSourceFile(
    join(output, "schemas", `${schemaName}.ts`),
    undefined,
    {
      overwrite: true
    }
  );
  sf.replaceWithText(writer => {
    const fields = model.fields.filter(
      field =>
        !AUXILIARY_FIELDS.includes(field.name) &&
        !isDataModel(field.type.reference?.ref)
    );

    writer.writeLine("/* eslint-disable */");
    writer.writeLine(getFileHeader("Drizzle ORM"));
    writer.writeLine(generator.importStatement);
    writer.writeLine(
      `import { UniqueIdGenerator } from "@stormstack/core-shared-utilities/common/unique-id-generator";`
    );
    writer.writeLine(
      `import { DateTime } from "@stormstack/core-shared-utilities/common/date-time";`
    );

    // import enum schemas
    for (const field of fields) {
      if (field.type.reference?.ref && isEnum(field.type.reference?.ref)) {
        writer.writeLine(
          `import { ${upperCaseFirst(
            field.type.reference?.ref.name
          )} } from "../enums/${kebabCase(field.type.reference?.ref.name)}";`
        );
      }
    }

    model.fields
      .filter(modelField => isDataModel(modelField.type.reference?.ref))
      .forEach(modelField => {
        writer.writeLine(
          `import { ${lowerCaseFirst(
            modelField.type.reference.ref.name
          )} } from "./${kebabCase(
            modelField.type.reference.ref.name
          )}.schema";`
        );
      });

    // create base schema
    writer.writeLine("");
    writer.write(generator.getTableSchema(model.name));
    writer.inlineBlock(() => {
      fields.forEach(field => {
        writer.writeLine(
          `${field.name}: ${generator.getFieldSchema(model, field)},`
        );
      });
    });
    writer.writeLine(");");
    writer.writeLine("");

    writer.writeLine("");
  });

  return schemaName;
}

/*async function generateObjectSchemas(
  inputObjectTypes: DMMF.InputType[],
  project: Project,
  output: string,
  storm: Model
) {
  const moduleNames: string[] = [];
  for (let i = 0; i < inputObjectTypes.length; i += 1) {
    const fields = inputObjectTypes[i]?.fields;
    const name = inputObjectTypes[i]?.name;
    const transformer = new Transformer({ name, fields, project, storm });
    const moduleName = generateObjectSchema(project);
    moduleNames.push(moduleName);
  }
  project.createSourceFile(
    join(output, "objects/index.ts"),
    moduleNames.map(name => `export * from './${name}';`).join("\n"),
    { overwrite: true }
  );
}

async function generateModelSchema(
  model: DataModel,
  project: Project,
  output: string,
  dataSourceProvider: ConnectorType
) {
  let generator: SchemaGenerator;
  switch (dataSourceProvider) {
    case "sqlite":
      generator = new SqliteSchemaGenerator();
      break;
    case "postgresql":
      generator = new PostgresqlSchemaGenerator();
      break;
    default:
      throw new Error(
        `Unsupported data source provider: ${dataSourceProvider}`
      );
  }

  const schemaName = `${kebabCase(model.name)}.schema`;
  const sf = project.createSourceFile(
    join(output, "schemas", `${schemaName}.ts`),
    undefined,
    {
      overwrite: true
    }
  );
  sf.replaceWithText(writer => {
    const fields = model.fields.filter(
      field =>
        !AUXILIARY_FIELDS.includes(field.name) &&
        !isDataModel(field.type.reference?.ref)
    );

    writer.writeLine("/* eslint-disable */
/*");
    writer.writeLine(getFileHeader("Drizzle ORM"));
    writer.writeLine(generator.importStatement);
    writer.writeLine(
      `import { UniqueIdGenerator } from "@stormstack/core-shared-utilities/common/unique-id-generator";`
    );
    writer.writeLine(
      `import { DateTime } from "@stormstack/core-shared-utilities/common/date-time";`
    );

    // import enum schemas
    for (const field of fields) {
      if (field.type.reference?.ref && isEnum(field.type.reference?.ref)) {
        writer.writeLine(
          `import { ${upperCaseFirst(
            field.type.reference?.ref.name
          )} } from "../enums/${kebabCase(field.type.reference?.ref.name)}";`
        );
      }
    }

    model.fields
      .filter(modelField => isDataModel(modelField.type.reference?.ref))
      .forEach(modelField => {
        writer.writeLine(
          `import { ${lowerCaseFirst(
            modelField.type.reference.ref.name
          )} } from "./${kebabCase(
            modelField.type.reference.ref.name
          )}.schema";`
        );
      });

    // create base schema
    writer.writeLine("");
    writer.write(generator.getTableSchema(model.name));
    writer.inlineBlock(() => {
      fields.forEach(field => {
        writer.writeLine(
          `${field.name}: ${generator.getFieldSchema(model, field)},`
        );
      });
    });
    writer.writeLine(");");
    writer.writeLine("");

    writer.writeLine("");
  });

  return schemaName;
}
*/
