import {
  DataModel,
  Enum,
  Model,
  isDataModel
} from "@open-system/tools-storm-language/ast";
import { getDefaultOutputFolder } from "@open-system/tools-storm-schema/plugins/plugin-utils";
import {
  AUXILIARY_FIELDS,
  PluginOptions,
  createProject,
  emitProject,
  getDataModels,
  getFileHeader,
  resolvePath,
  saveProject
} from "@open-system/tools-storm-schema/sdk";
import { DMMF } from "@prisma/generator-helper";
import { promises as fs } from "fs";
import { join } from "path";
import { CodeBlockWriter, Project } from "ts-morph";
import removeDir from "./utils/removeDir";
import { SchemaGenerator } from "./utils/schema-gen";

export async function generate(
  model: Model,
  options: PluginOptions,
  dmmf: DMMF.Document
) {
  let output = options.output as string;
  if (!output) {
    const defaultOutputFolder = getDefaultOutputFolder();
    if (defaultOutputFolder) {
      output = join(defaultOutputFolder, "graphql");
    } else {
      output = "./__generated__/graphql";
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
  /*await generateEnumSchemas(
    prismaClientDmmf.schema.enumTypes.prisma,
    prismaClientDmmf.schema.enumTypes.model ?? [],
    project,
    model
  );*/

  /*const dataSource = model.declarations.find((d): d is DataSource =>
    isDataSource(d)
  );

  const dataSourceProvider = getLiteral<string>(
    dataSource?.fields.find(f => f.name === "provider")?.value
  ) as ConnectorType;*/

  const generator = new SchemaGenerator();
  const sf = project.createSourceFile(
    join(output, "schema.graphql"),
    undefined,
    {
      overwrite: true
    }
  );

  sf.replaceWithText(writer => {
    writer.writeLine(`"""`);
    writer.writeLine(getFileHeader("GraphQL Schema", ""));
    writer.writeLine(`"""`);

    generateEnumSchemas(
      prismaClientDmmf.schema.enumTypes.model ?? [],
      project,
      model,
      writer,
      generator
    );
    generateModelSchemas(project, model, output, writer, generator);
  });

  // create barrel file
  const exports = [
    `export * as schemas from './schemas'`,
    `export * as enums from './enums'`
  ];

  /*project.createSourceFile(join(output, "index.ts"), exports.join(";\n"), {
    overwrite: true
  });*/

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
}

function generateEnumSchemas(
  modelSchemaEnum: DMMF.SchemaEnum[],
  project: Project,
  model: Model,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const enums: Enum[] = model.declarations.reduce((ret, decl) => {
    if (decl.$type === Enum) {
      ret.push(decl as Enum);
    }

    return ret;
  }, []);
  enums.forEach(enumModel => {
    writer.writeLine("");
    if (enumModel.comments && enumModel.comments.length > 0) {
      writer.writeLine(`"""`);
      writer.writeLine(enumModel.comments.join("\n"));
      writer.writeLine(`"""`);
    }
    writer.writeLine(`enum ${enumModel.name} {`);
    enumModel.fields.forEach(enumField => {
      if (enumField.comments && enumField.comments.length > 0) {
        writer.writeLine(`"""`);
        writer.writeLine(enumField.comments.join("\n"));
        writer.writeLine(`"""`);
      }

      writer.writeLine(`  ${enumField.name}`);
    });
    writer.writeLine("}");
    writer.writeLine("");
  });
}

function generateModelSchemas(
  project: Project,
  storm: Model,
  output: string,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const schemaNames: string[] = [];
  for (const dm of getDataModels(storm)) {
    generateModelSchema(dm, writer, generator);
  }

  writer.write(generator.getScalarsSchema());
}

function generateModelSchema(
  model: DataModel,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const fields = model.fields.filter(
    field =>
      !AUXILIARY_FIELDS.includes(field.name) &&
      (!isDataModel(field.type.reference?.ref) ||
        field.attributes.every(attr => attr.decl.ref?.name !== "@relation"))
  );

  // import enum schemas
  /*for (const field of fields) {
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
        )} } from "./${kebabCase(modelField.type.reference.ref.name)}.schema";`
      );
    });*/

  // create base schema
  writer.writeLine("");
  if (model.comments && model.comments.length > 0) {
    writer.writeLine(`"""`);
    writer.writeLine(model.comments.join("\n"));
    writer.writeLine(`"""`);
  }
  writer.writeLine(`type ${model.name} {`);
  fields.forEach(field => {
    if (field.comments && field.comments.length > 0) {
      writer.writeLine(
        `  """
  ${field.comments.join("\n")}
  """`
      );
    }
    writer.writeLine(
      `  ${field.name}${generator.getFieldSchema(model, field)}`
    );
  });
  writer.writeLine("}");
  writer.writeLine("");
  writer.writeLine(generator.getRelationsSchema(model));
  writer.writeLine("");
}
