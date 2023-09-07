import { codegen } from "@graphql-codegen/core";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import * as typescriptResolversPlugin from "@graphql-codegen/typescript-resolvers";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import {
  constantCase,
  kebabCase,
  lowerCaseFirst,
  upperCaseFirst
} from "@open-system/core-shared-utilities/common/string-fns";
import { ConsoleLogger } from "@open-system/core-shared-utilities/logging";
import {
  ApiModel,
  DataModel,
  Enum,
  Input,
  Interface,
  Model,
  Operation,
  OperationGroup,
  isDataModel,
  isEnum
} from "@open-system/tools-storm-language/ast";
import { getDefaultOutputFolder } from "@open-system/tools-storm-schema/plugins/plugin-utils";
import {
  AUXILIARY_FIELDS,
  PluginOptions,
  createProject,
  emitProject,
  formatString,
  getFileHeader,
  resolvePath,
  saveProject
} from "@open-system/tools-storm-schema/sdk";
import { existsSync, promises as fs } from "fs";
import { mkdir } from "fs/promises";
import { parse, printSchema } from "graphql";
import { join } from "path";
import { CodeBlockWriter, Project } from "ts-morph";
import { ENTITY_CLASS_FIELDS, EntityClassFields } from "./types";
import { EntityGenerator } from "./utils/entity-gen";
import { enrichModel } from "./utils/model-enrich";
import removeDir from "./utils/removeDir";
import { SchemaGenerator } from "./utils/schema-gen";

export async function generate(model: Model, options: PluginOptions) {
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

  const { dataModels, operationGroups, inputs, apiModels, interfaces, enums } =
    enrichModel(model);

  const generator = new SchemaGenerator();

  const sfSchema = project.createSourceFile(
    join(output, "schema.graphql"),
    undefined,
    {
      overwrite: true
    }
  );
  sfSchema.replaceWithText(writer => {
    generateInterfaceSchemas(project, interfaces, writer, generator);
    generateEnumSchemas(project, enums, writer, generator);
    generateOperationSchemas(project, operationGroups, writer, generator);
    generateInputSchemas(project, inputs, writer, generator);
    generateDataModelSchemas(project, dataModels, writer, generator);
    generateApiModelSchemas(project, apiModels, writer, generator);

    writer.write(generator.getScalarsSchema());
  });

  const sfResolvers = project.createSourceFile(
    join(output, "resolvers.ts"),
    undefined,
    {
      overwrite: true
    }
  );
  sfResolvers.replaceWithText(writer => {
    writer.writeLine("/* eslint-disable */");
    writer.writeLine(getFileHeader("GraphQL Schema", "//"));

    generateResolvers(
      project,
      dataModels,
      apiModels,
      interfaces,
      enums,
      inputs,
      operationGroups,
      writer,
      generator
    );
  });

  await generateEntities(project, dataModels, output);

  const sfIndex = project.createSourceFile(
    join(output, "index.ts"),
    undefined,
    {
      overwrite: true
    }
  );
  sfIndex.replaceWithText(writer => {
    writer.writeLine('export * from "./entities";');
    writer.writeLine('export * from "./types";');
    writer.writeLine('export * from "./resolvers";');
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

  ConsoleLogger.info("GraphQL Schema has been successfully generated");

  await generateGraphQLTypes(
    output,
    dataModels,
    apiModels,
    interfaces,
    enums,
    inputs,
    operationGroups
  );
}

async function handleGeneratorOutputValue(output: string) {
  // create the output directory and delete contents that might exist from a previous run
  await fs.mkdir(output, { recursive: true });
  const isRemoveContentsOnly = true;
  await removeDir(output, isRemoveContentsOnly);
}

function generateResolvers(
  project: Project,
  dataModels: DataModel[],
  apiModels: ApiModel[],
  interfaces: Interface[],
  enums: Enum[],
  inputs: Input[],
  operationGroups: OperationGroup[],
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const entities = dataModels.map(dataModel => dataModel.name);
  writer.writeLine("");
  writer.writeLine(generator.getScalarsImport());
  writer.writeLine(`import {
    Resolvers,
    ${entities
      .map(entity => `${entity}, ${entity}Edge, ${entity}Connection`)
      .join(", ")}
} from "./types"`);
  writer.writeLine(
    'import { extractRepository } from "@open-system/core-server-application/context/context";'
  );
  writer.writeLine(
    'import { FindManyParams, FindUniqueParams, UserContext } from "@open-system/core-server-application/types";'
  );
  writer.writeLine(
    'import { GraphQLServerContext } from "@open-system/core-server-graphql/types";'
  );

  writer.writeLine("");

  writer.writeLine(`export const resolvers: Resolvers<
  GraphQLServerContext<Array<${entities.join(" | ")}>, UserContext>
> = {`);
  writer.write(`${generator.getScalarsResolvers()},`);

  const queryOperationGroup = operationGroups.find(
    operationGroup => operationGroup.name === "Query"
  );
  const mutationOperationGroup = operationGroups.find(
    operationGroup => operationGroup.name === "Mutation"
  );

  if (queryOperationGroup) {
    writer.writeLine(`${queryOperationGroup.name}: {`);

    queryOperationGroup.fields.forEach((operation: Operation, i: number) => {
      const isFindMany =
        !!operation.resultType?.reference?.ref?.name?.endsWith("Connection");

      // TODO: Find a better way to do this
      const entityName = upperCaseFirst(
        isFindMany && operation.name.charAt(operation.name.length - 1) === "s"
          ? operation.name.slice(0, -1)
          : operation.name
      );

      writer.writeLine(
        `async ${operation.name}(target, args, context, info) {`
      );
      writer.write(`
  const repository = extractRepository<${entityName}>(context, "${lowerCaseFirst(
        entityName
      )}");
  const results = await repository.find${
    isFindMany ? "Many" : "Unique"
  }(args.selector as unknown as Find${
        isFindMany ? "Many" : "Unique"
      }Params<${entityName}>);

${
  isFindMany
    ? `
  let startCursor!: string;
  let endCursor!: string;
  const edges = results.map((result, index) => {
    if (index === 0) {
      startCursor = result.id;
    } else if (index === results.length - 1) {
      endCursor = result.id;
    }

    return {
      __typename: "${entityName}Edge",
      node: result,
      cursor: result.id
    } as ${entityName}Edge;
  });

  return {
    __typename: "${entityName}Connection",
    edges,
    pageInfo: {
      __typename: "PageInfo",
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor,
      endCursor
    },
    totalCount: results.length
  };
`
    : `
  return results;
`
}`);
      writer.writeLine(i < queryOperationGroup.fields.length - 1 ? "}," : "}");
    });

    writer.writeLine(
      mutationOperationGroup?.fields && mutationOperationGroup.fields.length > 0
        ? "},"
        : "}"
    );
  }

  if (mutationOperationGroup) {
    writer.writeLine(`${mutationOperationGroup.name}: {`);

    mutationOperationGroup.fields.forEach((operation: Operation, i: number) => {
      writer.writeLine(`async ${operation.name}(root, args, ctx, info) {`);
      writer.writeLine(
        i < mutationOperationGroup.fields.length - 1 ? "}," : "}"
      );
    });

    writer.writeLine("}");
  }

  writer.writeLine("}");
  writer.writeLine("");
}

async function generateGraphQLTypes(
  output: string,
  dataModels: DataModel[],
  apiModels: ApiModel[],
  interfaces: Interface[],
  enums: Enum[],
  inputs: Input[],
  operationGroups: OperationGroup[]
) {
  const schema = await loadSchema(join(output, "**/*.graphql"), {
    loaders: [new GraphQLFileLoader()]
  });
  if (schema) {
    const typesDir = join(output, "types");
    if (!existsSync(typesDir)) {
      await mkdir(typesDir);
    }

    ConsoleLogger.debug("Loading GraphQL schema types codegen");
    const typesOutput = await codegen({
      documents: [],
      config: {},
      filename: join(typesDir, "schema-types.ts"),
      schema: parse(printSchema(schema)),
      plugins: [
        {
          typescript: {
            constEnums: true,
            enumsAsConst: true,
            enumsAsTypes: true,
            futureProofEnums: true,
            futureProofUnions: true,
            skipTypename: false,
            nonOptionalTypename: true,
            scalars: {
              ID: {
                input: "string",
                output: "string"
              },
              JSON: "{ [key: string]: any }"
            }
          }
        }
      ],
      pluginMap: {
        typescript: typescriptPlugin
      }
    });

    ConsoleLogger.debug("Writing GraphQL schema types codegen file");
    await fs.writeFile(
      join(output, "types", "schema-types.ts"),
      await formatString(`/* eslint-disable */
${getFileHeader("GraphQL Schema", "//")}

${typesOutput}`),
      "utf8"
    );

    ConsoleLogger.debug("Loading GraphQL schema resolvers codegen");
    const resolversOutput = await codegen({
      documents: [],
      config: {},
      filename: join(typesDir, "resolvers-types.ts"),
      schema: parse(printSchema(schema)),
      plugins: [
        {
          typescriptResolvers: {
            contextType:
              "@open-system/core-server-graphql/types#GraphQLServerContext",
            mappers: {
              IEntity: "@open-system/core-server-domain/types#IEntity"
            }
          }
        }
      ],
      pluginMap: {
        typescriptResolvers: typescriptResolversPlugin
      }
    });

    const mutationOperationGroup: OperationGroup = operationGroups.find(
      operationGroup => operationGroup.name === "Mutation"
    );

    ConsoleLogger.debug("Writing GraphQL schema resolvers codegen file");
    await fs.writeFile(
      join(output, "types", "resolvers-types.ts"),
      await formatString(`/* eslint-disable */
${getFileHeader("GraphQL Schema", "//")}

// import { GraphQLServerContext } from "@open-system/core-server-graphql/types";
import { Maybe, Scalars, ${dataModels
        .map(dataModel => dataModel.name)
        .join(", ")}, ${inputs.map(input => input.name).join(", ")}, ${enums
        .map(enumObj => enumObj.name)
        .join(", ")}, ${apiModels
        .map(apiModel => apiModel.name)
        .join(", ")}, ${mutationOperationGroup.fields
        .map(
          operation =>
            `${upperCaseFirst(operation.name)}Ok, ${upperCaseFirst(
              operation.name
            )}InputErrors, ${upperCaseFirst(
              operation.name
            )}Error, ${upperCaseFirst(operation.name)}Result`
        )
        .join(", ")}, ${operationGroups
        .map(operationGroup =>
          operationGroup.fields
            .filter(
              operation => operation.params && operation.params.length > 0
            )
            .map(
              operation =>
                `${upperCaseFirst(operationGroup.name)}${upperCaseFirst(
                  operation.name
                )}Args`
            )
            .join(", ")
        )
        .join(", ")}, ${dataModels
        .filter(dataModel =>
          dataModel.fields.some(field =>
            field.attributes.some(attr => attr.decl.ref?.name === "@relation")
          )
        )
        .map(dataModel => `${dataModel.name}sArgs`)
        .join(", ")} } from "./schema-types";

${resolversOutput}`),
      "utf8"
    );

    await fs.writeFile(
      join(typesDir, "index.ts"),
      `export * from "./schema-types";
export * from "./resolvers-types";`,
      "utf8"
    );
  }
}

async function generateEntities(
  project: Project,
  dataModels: DataModel[],
  output: string
) {
  const entityDir = join(output, "entities");
  if (!existsSync(entityDir)) {
    await mkdir(entityDir);
  }

  dataModels.forEach(dataModel => {
    const sfInterface = project.createSourceFile(
      join(entityDir, `${kebabCase(dataModel.name)}-entity.interface.ts`),
      undefined,
      {
        overwrite: true
      }
    );
    sfInterface.replaceWithText(writer => {
      const generator = new EntityGenerator();

      const enumFields = dataModel.fields.filter(field =>
        isEnum(field.type.reference?.ref)
      );
      const dataModelFields = dataModel.fields.filter(field =>
        isDataModel(field.type.reference?.ref)
      );

      const content = generateEntityInterfaceSchema(dataModel, generator);

      writer.write(`/* eslint-disable */

import { IEntity } from "@open-system/core-server-domain/types";
import { ${enumFields
        .map(enumField => `${enumField.type.reference?.ref?.name}`)
        .join(", ")} } from "../types";
${dataModelFields
  .map(
    dataModelField =>
      `import { I${
        dataModelField.type.reference?.ref?.name
      }Entity } from "./${kebabCase(
        dataModelField.type.reference?.ref?.name
      )}-entity.interface";`
  )
  .join("\n")}
${generator.getImport()}

${getFileHeader("Entity (Interface)", "//")}

${content}`);
    });

    const sfEntity = project.createSourceFile(
      join(entityDir, `${kebabCase(dataModel.name)}-entity.ts`),
      undefined,
      {
        overwrite: true
      }
    );
    sfEntity.replaceWithText(writer => {
      const generator = new EntityGenerator();

      const enumFields = dataModel.fields.filter(field =>
        isEnum(field.type.reference?.ref)
      );
      const dataModelFields = dataModel.fields.filter(field =>
        isDataModel(field.type.reference?.ref)
      );

      const content = generateEntityClassSchema(dataModel, generator);

      writer.write(`/* eslint-disable */

import { Entity } from "@open-system/core-server-domain/entities";
import { I${upperCaseFirst(dataModel.name)}Entity } from "./${kebabCase(
        dataModel.name
      )}-entity.interface";
import { ${enumFields
        .map(enumField => `${enumField.type.reference?.ref?.name}`)
        .join(", ")} } from "../types";
${dataModelFields
  .map(
    dataModelField =>
      `import { ${
        dataModelField.type.reference?.ref?.name
      }Entity } from "./${kebabCase(
        dataModelField.type.reference?.ref?.name
      )}-entity";`
  )
  .join("\n")}
${generator.getImport()}

${getFileHeader("Entity (Class)", "//")}

${content}`);
    });
  });

  const sfEntitiesIndex = project.createSourceFile(
    join(entityDir, "index.ts"),
    undefined,
    {
      overwrite: true
    }
  );
  sfEntitiesIndex.replaceWithText(writer => {
    dataModels.forEach(dataModel => {
      writer.writeLine(
        `export * from "./${kebabCase(dataModel.name)}-entity.interface";`
      );
      writer.writeLine(
        `export * from "./${kebabCase(dataModel.name)}-entity";`
      );
    });
  });
}

function generateEnumSchemas(
  project: Project,
  enums: Enum[],
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
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

function generateDataModelSchemas(
  project: Project,
  models: DataModel[],
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  for (const dm of models) {
    generateDataModelSchema(dm, writer, generator);
  }
}

function generateDataModelSchema(
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
        : " implements IEntity"
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
  // writer.writeLine(generator.getRelationsSchema(model));
  // writer.writeLine("");
}

function generateInputSchemas(
  project: Project,
  inputs: Input[],
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  for (const dm of inputs) {
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
  operationGroups: OperationGroup[],
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  const filtered = operationGroups?.filter(
    dm => dm.fields && dm.fields.length > 0
  );
  generator.hasOperation = filtered && filtered.length > 0;

  for (const dm of filtered) {
    generateOperationSchema(dm, writer, generator);
  }

  const mutation = filtered.find(dm => dm.name === "Mutation");
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
  writer.writeLine(
    `${/*model.isExtend ? "extend " :*/ ""}type ${model.name} {`
  );
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
  models: ApiModel[],
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  for (const dm of models) {
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
  interfaces: Interface[],
  writer: CodeBlockWriter,
  generator: SchemaGenerator
) {
  for (const dm of interfaces) {
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

function generateEntityInterfaceSchema(
  model: DataModel,
  generator: EntityGenerator
): string {
  let content = "";

  const fields = model.fields.filter(
    field =>
      !AUXILIARY_FIELDS.includes(field.name) &&
      (!isDataModel(field.type.reference?.ref) ||
        field.attributes.every(attr => attr.decl.ref?.name !== "@relation"))
  );

  // create base schema
  if (model.comments && model.comments.length > 0) {
    content += `/**
      ${model.comments
        .map(comment => `* ${comment.replace("/// ", "")}`)
        .join("\n")}
*/
`;
  }

  content += `export interface I${upperCaseFirst(
    model.name
  )}Entity extends IEntity${
    model.implements && model.implements.length > 0
      ? `, ${model.implements.map(impl => impl.ref.name).join(", ")}`
      : ""
  } {
    __typename: "${upperCaseFirst(model.name)}";
`;
  fields.forEach(field => {
    if (field.comments && field.comments.length > 0) {
      content += `/**
 ${field.comments.map(comment => `* ${comment.replace("/// ", "")}`).join("\n")}
  */
`;
    }
    content += ` ${field.name}${generator.getInterfaceField(field)};
`;
  });
  content += "\n}\n";

  return content;
}

function generateEntityClassSchema(
  model: DataModel,
  generator: EntityGenerator
) {
  let content = "";

  const fields = model.fields.filter(
    field =>
      !AUXILIARY_FIELDS.includes(field.name) &&
      (!isDataModel(field.type.reference?.ref) ||
        field.attributes.every(attr => attr.decl.ref?.name !== "@relation"))
  );

  // create base schema
  if (model.comments && model.comments.length > 0) {
    content += `/**
      ${model.comments
        .map(comment => `* ${comment.replace("/// ", "")}`)
        .join("\n")}
*/
`;
  }

  content += `export class ${upperCaseFirst(
    model.name
  )}Entity extends Entity implements I${upperCaseFirst(model.name)}Entity${
    model.implements && model.implements.length > 0
      ? `, ${model.implements.map(impl => impl.ref.name).join(", ")}`
      : ""
  } {
    public get __typename(): "${upperCaseFirst(model.name)}" {
      return "${upperCaseFirst(model.name)}";
    }
`;
  fields
    .filter(
      field => !ENTITY_CLASS_FIELDS.includes(field.name as EntityClassFields)
    )
    .forEach(field => {
      if (field.comments && field.comments.length > 0) {
        content += `/**
 ${field.comments.map(comment => `* ${comment.replace("/// ", "")}`).join("\n")}
  */
`;
      }
      content += `public ${field.name}${generator.getField(field)};

`;
    });
  content += "\n}\n";

  return content;
}
