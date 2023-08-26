import {
  kebabCase,
  lowerCaseFirst,
  upperCaseFirst
} from "@open-system/core-shared-utilities/common/string-fns";
import {
  ArrayExpr,
  DataModel,
  Enum,
  MemberAccessExpr,
  Model,
  isDataModel,
  isEnum
} from "@open-system/tools-storm-language/ast";
import { getDefaultOutputFolder } from "@open-system/tools-storm-schema/plugins/plugin-utils";
import { PrismaModel } from "@open-system/tools-storm-schema/plugins/prisma/prisma-builder";
import PrismaSchemaGenerator from "@open-system/tools-storm-schema/plugins/prisma/schema-generator";
import {
  AUXILIARY_FIELDS,
  PluginOptions,
  createProject,
  emitProject,
  getDataModels,
  getFileHeader,
  isForeignKeyField,
  resolvePath,
  saveProject
} from "@open-system/tools-storm-schema/sdk";
import { DMMF } from "@prisma/generator-helper";
import { promises as fs } from "fs";
import { join } from "path";
import { Project } from "ts-morph";
import Transformer from "./transformer";
import removeDir from "./utils/removeDir";
import { makeFieldSchema } from "./utils/schema-gen";

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

  /*const dataSource = model.declarations.find((d): d is DataSource =>
    isDataSource(d)
  );

  const dataSourceProvider = getLiteral<string>(
    dataSource?.fields.find(f => f.name === "provider")?.value
  ) as ConnectorType;*/

  await generateModelSchemas(project, model, output);

  /*if (options.modelOnly !== true) {
    // detailed object schemas referenced from input schemas
    Transformer.provider = dataSourceProvider;
    addMissingInputObjectTypes(inputObjectTypes, outputObjectTypes, models);
    const aggregateOperationSupport =
      resolveAggregateOperationSupport(inputObjectTypes);
    //await generateObjectSchemas(inputObjectTypes, project, output, model);

    // input schemas
    const transformer = new Transformer({
      models,
      modelOperations,
      aggregateOperationSupport,
      project,
      storm: model
    });
    await transformer.generateInputSchemas();
  }*/

  // create barrel file
  const exports = [
    `export * as schemas from './schemas'`,
    `export * as enums from './enums'`
  ];
  /*if (options.modelOnly !== true) {
    exports.push(
      `export * as input from './input'`,
      `export * as objects from './objects'`
    );
  }*/
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
  output: string
) {
  const schemaNames: string[] = [];
  for (const dm of getDataModels(storm)) {
    schemaNames.push(await generateModelSchema(dm, project, output));
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
  output: string
) {
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
        // scalar fields only
        !isDataModel(field.type.reference?.ref)
    );

    writer.writeLine("/* eslint-disable */");
    writer.writeLine(getFileHeader("Drizzle ORM"));
    writer.writeLine(
      `import { blob, integer, real, text, sqliteTable } from "drizzle-orm/sqlite-core";`
    );
    writer.writeLine(
      `import { UniqueIdGenerator } from "@open-system/core-shared-utilities/common/unique-id-generator";`
    );
    writer.writeLine(
      `import { DateTime } from "@open-system/core-shared-utilities/common/date-time";`
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

    // create base schema
    writer.write(
      `
export const ${lowerCaseFirst(model.name)} = sqliteTable("${lowerCaseFirst(
        model.name
      )}", `
    );
    writer.inlineBlock(() => {
      fields.forEach(field => {
        let fieldLine = `${field.name}: ${makeFieldSchema(field)}`;

        if (isForeignKeyField(field)) {
          // field.attributes.find(a => a.name === "relation")
          const attribute = field.attributes.find(
            attr => attr.decl.ref?.name === "@relation"
          );
          if (attribute) {
            //const foreignKeyFields = attr.args.find(a => a.name === "fields");
            const referencesFields = attribute.args.find(
              a => a.name === "references"
            )?.value as ArrayExpr;
            referencesFields.items.forEach(item => {
              const reference = item as MemberAccessExpr;

              /*const modelFields = model.fields.filter(field =>
            isDataModel(field.type.reference?.ref)
          );*/

              fieldLine += `.references(() => ${lowerCaseFirst(
                field.type.reference?.ref.name
              )}.${reference?.member?.ref?.name})`;
            });
          }
        }

        writer.writeLine(`${fieldLine},`);
      });
    });
    writer.writeLine(");");
  });
  return schemaName;
}
