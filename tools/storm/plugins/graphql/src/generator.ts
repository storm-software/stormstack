import {
  constantCase,
  upperCaseFirst
} from "@open-system/core-shared-utilities/common/string-fns";
import {
  ApiModel,
  DataModel,
  Enum,
  Input,
  Interface,
  Model,
  OperationGroup,
  isDataModel
} from "@open-system/tools-storm-language/ast";
import { getDefaultOutputFolder } from "@open-system/tools-storm-schema/plugins/plugin-utils";
import {
  AUXILIARY_FIELDS,
  PluginOptions,
  createProject,
  emitProject,
  getApiModels,
  getDataModels,
  getFileHeader,
  getInputs,
  getInterfaces,
  getOperationGroups,
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

  // StormGeneratedSharedModule.AstReflection.

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

    generateInterfaceSchemas(project, model, output, writer, generator);
    generateEnumSchemas(
      prismaClientDmmf.schema.enumTypes.model ?? [],
      project,
      model,
      writer,
      generator
    );
    generateOperationSchemas(project, model, output, writer, generator);
    generateInputSchemas(project, model, output, writer, generator);

    generateModelSchemas(project, model, output, writer, generator);
    generateApiModelSchemas(project, model, output, writer, generator);

    writer.write(generator.getScalarsSchema());
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
      writer.writeLine(
        enumModel.comments
          .map(comment => comment.replace("/// ", ""))
          .join("\n")
      );
      writer.writeLine(`"""`);
    }
    writer.writeLine(`enum ${enumModel.name} {`);
    enumModel.fields.forEach(enumField => {
      if (enumField.comments && enumField.comments.length > 0) {
        writer.writeLine(`"""`);
        writer.writeLine(
          enumField.comments
            .map(comment => comment.replace("/// ", ""))
            .join("\n")
        );
        writer.writeLine(`"""`);
      }

      writer.writeLine(`  ${constantCase(enumField.name)}`);
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
  for (const dm of getDataModels(storm)) {
    generateModelSchema(dm, writer, generator);
  }
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

  // create base schema
  writer.writeLine("");
  if (model.comments && model.comments.length > 0) {
    writer.writeLine(`"""`);
    writer.writeLine(
      model.comments.map(comment => comment.replace("/// ", "")).join("\n")
    );
    writer.writeLine(`"""`);
  }
  writer.writeLine(
    `${model.isExtend ? "extend " : ""}type ${model.name}${
      model.implements && model.implements.length > 0
        ? ` implements ${model.implements
            .map(impl => impl.ref.name)
            .join(", ")}`
        : " implements Node"
    } {`
  );
  fields.forEach(field => {
    if (field.comments && field.comments.length > 0) {
      writer.writeLine(
        `  """
  ${field.comments.map(comment => comment.replace("/// ", "")).join("\n")}
  """`
      );
    }
    writer.writeLine(`  ${field.name}${generator.getFieldSchema(field)}`);
  });
  writer.writeLine("}");
  writer.writeLine("");
  writer.writeLine(generator.getRelationsSchema(model));
  writer.writeLine("");
}

function generateInputSchemas(
  project: Project,
  storm: Model,
  output: string,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  for (const dm of getInputs(storm)) {
    generateInputSchema(dm, writer, generator);
  }
}

function generateInputSchema(
  model: Input,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const fields = model.fields.filter(
    field =>
      !AUXILIARY_FIELDS.includes(field.name) &&
      (!isDataModel(field.type.reference?.ref) ||
        field.attributes.every(attr => attr.decl.ref?.name !== "@relation"))
  );

  // create base schema
  writer.writeLine("");
  if (model.comments && model.comments.length > 0) {
    writer.writeLine(`"""`);
    writer.writeLine(
      model.comments.map(comment => comment.replace("/// ", "")).join("\n")
    );
    writer.writeLine(`"""`);
  }
  writer.writeLine(`input ${model.name} {`);
  fields.forEach(field => {
    if (field.comments && field.comments.length > 0) {
      writer.writeLine(
        `  """
  ${field.comments.map(comment => comment.replace("/// ", "")).join("\n")}
  """`
      );
    }
    writer.writeLine(`  ${field.name}${generator.getFieldSchema(field)}`);
  });
  writer.writeLine("}");
  writer.writeLine("");
}

function generateOperationSchemas(
  project: Project,
  storm: Model,
  output: string,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const operationGroups = getOperationGroups(storm);
  generator.hasOperation = operationGroups?.some(
    dm => dm.fields && dm.fields.length > 0
  );

  for (const dm of operationGroups) {
    generateOperationSchema(dm, writer, generator);
  }

  const mutation = operationGroups.find(dm => dm.name === "Mutation");
  if (mutation) {
    writer.writeLine(generator.getMutationResultSchema(mutation));
  }
}

function generateOperationSchema(
  model: OperationGroup,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const fields = model.fields.filter(
    field =>
      !AUXILIARY_FIELDS.includes(field.name) &&
      !field.attributes.some(attr => attr.decl.ref?.name === "@omit")
  );

  const isMutation = model.name === "Mutation";

  // create base schema
  writer.writeLine("");
  if (model.comments && model.comments.length > 0) {
    writer.writeLine(`"""`);
    writer.writeLine(
      model.comments.map(comment => comment.replace("/// ", "")).join("\n")
    );
    writer.writeLine(`"""`);
  }
  writer.writeLine(`${model.isExtend ? "extend " : ""}type ${model.name} {`);
  fields.forEach(field => {
    if (field.comments && field.comments.length > 0) {
      writer.writeLine(
        `  """
  ${field.comments.map(comment => comment.replace("/// ", "")).join("\n")}
  """`
      );
    }
    writer.writeLine(
      `  ${field.name}${field.params.length > 0 ? "(" : ""}${field.params
        .map(param => generator.getOperationInputParam(param))
        .join(", ")}${field.params.length > 0 ? ")" : ""}: ${
        isMutation
          ? `${upperCaseFirst(field.name)}Result!`
          : generator.getColumnTypeSchema(field.resultType)
      }`
    );
  });
  writer.writeLine("}");
  writer.writeLine("");
}

function generateApiModelSchemas(
  project: Project,
  storm: Model,
  output: string,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  for (const dm of getApiModels(storm)) {
    generateApiModelSchema(dm, writer, generator);
  }
}

function generateApiModelSchema(
  model: ApiModel,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const fields = model.fields.filter(
    field =>
      !AUXILIARY_FIELDS.includes(field.name) &&
      (!isDataModel(field.type.reference?.ref) ||
        field.attributes.every(attr => attr.decl.ref?.name !== "@relation"))
  );

  // create base schema
  writer.writeLine("");
  if (model.comments && model.comments.length > 0) {
    writer.writeLine(`"""`);
    writer.writeLine(
      model.comments.map(comment => comment.replace("/// ", "")).join("\n")
    );
    writer.writeLine(`"""`);
  }
  writer.writeLine(
    `${model.isExtend ? "extend " : ""}type ${model.name}${
      model.implements && model.implements.length > 0
        ? ` implements ${model.implements
            .map(impl => impl.ref.name)
            .join(", ")}`
        : ""
    } {`
  );
  fields.forEach(field => {
    if (field.comments && field.comments.length > 0) {
      writer.writeLine(
        `  """
  ${field.comments.map(comment => comment.replace("/// ", "")).join("\n")}
  """`
      );
    }
    writer.writeLine(`  ${field.name}${generator.getFieldSchema(field)}`);
  });
  writer.writeLine("}");
  writer.writeLine("");
  writer.writeLine("");
}

function generateInterfaceSchemas(
  project: Project,
  storm: Model,
  output: string,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  for (const dm of getInterfaces(storm)) {
    generateInterfaceSchema(dm, writer, generator);
  }
}

function generateInterfaceSchema(
  model: Interface,
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const fields = model.fields.filter(
    field =>
      !AUXILIARY_FIELDS.includes(field.name) &&
      (!isDataModel(field.type.reference?.ref) ||
        field.attributes.every(attr => attr.decl.ref?.name !== "@relation"))
  );

  // create base schema
  writer.writeLine("");
  if (model.comments && model.comments.length > 0) {
    writer.writeLine(`"""`);
    writer.writeLine(
      model.comments.map(comment => comment.replace("/// ", "")).join("\n")
    );
    writer.writeLine(`"""`);
  }
  writer.writeLine(
    `${model.isExtend ? "extend " : ""}interface ${model.name} {`
  );
  fields.forEach(field => {
    if (field.comments && field.comments.length > 0) {
      writer.writeLine(
        `  """
  ${field.comments.map(comment => comment.replace("/// ", "")).join("\n")}
  """`
      );
    }
    writer.writeLine(`  ${field.name}${generator.getFieldSchema(field)}`);
  });
  writer.writeLine("}");
  writer.writeLine("");
  writer.writeLine("");
}
