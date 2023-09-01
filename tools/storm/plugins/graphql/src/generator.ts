import { codegen } from "@graphql-codegen/core";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import * as typescriptResolversPlugin from "@graphql-codegen/typescript-resolvers";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import {
  constantCase,
  lowerCaseFirst,
  upperCaseFirst
} from "@open-system/core-shared-utilities/common/string-fns";
import {
  ApiModel,
  DataModel,
  DataModelField,
  DataModelFieldType,
  Enum,
  EnumField,
  Input,
  Interface,
  Model,
  Operation,
  OperationGroup,
  OperationInputParam,
  isDataModel
} from "@open-system/tools-storm-language/ast";
import { getDefaultOutputFolder } from "@open-system/tools-storm-schema/plugins/plugin-utils";
import {
  AUXILIARY_FIELDS,
  PluginOptions,
  createProject,
  emitProject,
  formatString,
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
import { existsSync, promises as fs } from "fs";
import { mkdir } from "fs/promises";
import { parse, printSchema } from "graphql";
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

  /*const modelOperations = prismaClientDmmf.mappings.modelOperations;
  const inputObjectTypes = prismaClientDmmf.schema.inputObjectTypes.prisma;
  const outputObjectTypes = prismaClientDmmf.schema.outputObjectTypes.prisma;
  const models: DMMF.Model[] = prismaClientDmmf.datamodel.models;*/

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

  const dataModels = getDataModels(model);
  const operationGroups = getOperationGroups(model);
  const inputs = getInputs(model);
  const apiModels = getApiModels(model);
  const interfaces = getInterfaces(model);

  const enums: Enum[] = model.declarations.reduce((ret, decl) => {
    if (decl.$type === Enum) {
      ret.push(decl as Enum);
    }

    return ret;
  }, []);

  const rootContainer =
    apiModels.length > 0 ? apiModels[0].$container : undefined;

  // Add operation
  let queryOperationGroup: OperationGroup = operationGroups.find(
    operationGroup => operationGroup.name === "Query"
  );
  if (!queryOperationGroup) {
    queryOperationGroup = {
      $container: rootContainer,
      $type: "OperationGroup",
      attributes: [],
      comments: [],
      name: "Query",
      fields: [],
      isExtend: true,
      superTypes: [],
      $resolvedFields: []
    };
    model.declarations.push(queryOperationGroup);
    operationGroups.push(queryOperationGroup);
  }
  /*queryOperationGroup.comments.length === 0 &&
          queryOperationGroup.comments.push(
            "The root query typ which gives access to read operations."
          );*/

  let mutationOperationGroup: OperationGroup = operationGroups.find(
    operationGroup => operationGroup.name === "Mutation"
  );
  if (!mutationOperationGroup) {
    mutationOperationGroup = {
      $container: rootContainer,
      $type: "OperationGroup",
      attributes: [],
      comments: [],
      name: "Mutation",
      fields: [],
      isExtend: true,
      superTypes: [],
      $resolvedFields: []
    };
    model.declarations.push(mutationOperationGroup);
    operationGroups.push(mutationOperationGroup);
  }
  /*mutationOperationGroup.comments.length === 0 &&
          mutationOperationGroup.comments.push(
            "The root mutation type which gives access to write operations."
          );*/

  const sortOrderEnum: Enum = {
    name: "SortOrder",
    $container: rootContainer,
    $type: "Enum",
    attributes: [],
    comments: [],
    fields: []
  };

  const sortOrderAscEnumField: EnumField = {
    name: "ASC",
    $container: sortOrderEnum,
    $type: "EnumField",
    attributes: [],
    comments: []
  };
  sortOrderEnum.fields.push(sortOrderAscEnumField);

  const sortOrderDescEnumField: EnumField = {
    name: "DESC",
    $container: sortOrderEnum,
    $type: "EnumField",
    attributes: [],
    comments: []
  };
  sortOrderEnum.fields.push(sortOrderDescEnumField);

  enums.push(sortOrderEnum);

  const stringFilter: Input = {
    $container: rootContainer,
    $type: "Input",
    attributes: [],
    comments: [],
    fields: [],
    name: "StringFilter",
    superTypes: [],
    $resolvedFields: []
  };

  const stringFilterEqualsField: DataModelField = {
    name: "equals",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterEqualsField.type = {
    $container: stringFilterEqualsField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterEqualsField);

  const stringFilterInField: DataModelField = {
    name: "in",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterInField.type = {
    $container: stringFilterInField,
    $type: "DataModelFieldType",
    array: true,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterInField);

  const stringFilterNotInField: DataModelField = {
    name: "notIn",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterNotInField.type = {
    $container: stringFilterNotInField,
    $type: "DataModelFieldType",
    array: true,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterNotInField);

  const stringFilterLtField: DataModelField = {
    name: "lt",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterLtField.type = {
    $container: stringFilterLtField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterLtField);

  const stringFilterLteField: DataModelField = {
    name: "lte",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterLteField.type = {
    $container: stringFilterLteField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterLteField);

  const stringFilterGtField: DataModelField = {
    name: "gt",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterGtField.type = {
    $container: stringFilterGtField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterGtField);

  const stringFilterGteField: DataModelField = {
    name: "gte",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterGteField.type = {
    $container: stringFilterGteField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterGteField);

  const stringFilterContainsField: DataModelField = {
    name: "contains",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterContainsField.type = {
    $container: stringFilterContainsField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterContainsField);

  const stringFilterStartsWithField: DataModelField = {
    name: "startsWith",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterStartsWithField.type = {
    $container: stringFilterStartsWithField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterStartsWithField);

  const stringFilterEndsWithField: DataModelField = {
    name: "endsWith",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterEndsWithField.type = {
    $container: stringFilterEndsWithField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterEndsWithField);

  const stringFilterNotField: DataModelField = {
    name: "not",
    "$container": stringFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  stringFilterNotField.type = {
    $container: stringFilterNotField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "String"
  } as DataModelFieldType;
  stringFilter.fields.push(stringFilterNotField);

  const dateTimeFilter: Input = {
    $container: rootContainer,
    $type: "Input",
    attributes: [],
    comments: [],
    fields: [],
    name: "DateTimeFilter",
    superTypes: [],
    $resolvedFields: []
  };

  const dateTimeFilterEqualsField: DataModelField = {
    name: "equals",
    "$container": dateTimeFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  dateTimeFilterEqualsField.type = {
    $container: dateTimeFilterEqualsField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "DateTime"
  } as DataModelFieldType;
  dateTimeFilter.fields.push(dateTimeFilterEqualsField);

  const dateTimeFilterInField: DataModelField = {
    name: "in",
    "$container": dateTimeFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  dateTimeFilterInField.type = {
    $container: dateTimeFilterInField,
    $type: "DataModelFieldType",
    array: true,
    optional: true,
    type: "DateTime"
  } as DataModelFieldType;
  dateTimeFilter.fields.push(dateTimeFilterInField);

  const dateTimeFilterNotInField: DataModelField = {
    name: "notIn",
    "$container": dateTimeFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  dateTimeFilterNotInField.type = {
    $container: dateTimeFilterNotInField,
    $type: "DataModelFieldType",
    array: true,
    optional: true,
    type: "DateTime"
  } as DataModelFieldType;
  dateTimeFilter.fields.push(dateTimeFilterNotInField);

  const dateTimeFilterLtField: DataModelField = {
    name: "lt",
    "$container": dateTimeFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  dateTimeFilterLtField.type = {
    $container: dateTimeFilterLtField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "DateTime"
  } as DataModelFieldType;
  dateTimeFilter.fields.push(dateTimeFilterLtField);

  const dateTimeFilterLteField: DataModelField = {
    name: "lte",
    "$container": dateTimeFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  dateTimeFilterLteField.type = {
    $container: dateTimeFilterLteField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "DateTime"
  } as DataModelFieldType;
  dateTimeFilter.fields.push(dateTimeFilterLteField);

  const dateTimeFilterGtField: DataModelField = {
    name: "gt",
    "$container": dateTimeFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  dateTimeFilterGtField.type = {
    $container: dateTimeFilterGtField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "DateTime"
  } as DataModelFieldType;
  dateTimeFilter.fields.push(dateTimeFilterGtField);

  const dateTimeFilterGteField: DataModelField = {
    name: "gte",
    "$container": dateTimeFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  dateTimeFilterGteField.type = {
    $container: dateTimeFilterGteField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "DateTime"
  } as DataModelFieldType;
  dateTimeFilter.fields.push(dateTimeFilterGteField);

  const dateTimeFilterNotField: DataModelField = {
    name: "not",
    "$container": dateTimeFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  dateTimeFilterNotField.type = {
    $container: dateTimeFilterNotField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "DateTime"
  } as DataModelFieldType;
  dateTimeFilter.fields.push(dateTimeFilterNotField);

  const boolFilter: Input = {
    $container: rootContainer,
    $type: "Input",
    attributes: [],
    comments: [],
    fields: [],
    name: "BoolFilter",
    superTypes: [],
    $resolvedFields: []
  };

  const boolFilterEqualsField: DataModelField = {
    name: "equals",
    "$container": boolFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  boolFilterEqualsField.type = {
    $container: boolFilterEqualsField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "Boolean"
  } as DataModelFieldType;
  boolFilter.fields.push(boolFilterEqualsField);

  const boolFilterNotField: DataModelField = {
    name: "not",
    "$container": boolFilter,
    "$type": "DataModelField",
    attributes: [],
    comments: [],
    type: undefined
  };
  boolFilterNotField.type = {
    $container: boolFilterNotField,
    $type: "DataModelFieldType",
    array: false,
    optional: true,
    type: "Boolean"
  } as DataModelFieldType;
  boolFilter.fields.push(boolFilterNotField);

  const pageInfo = {
    $container: rootContainer,
    $type: "ApiModel",
    attributes: [],
    comments: [
      "A base type to define the structure of paginated response data"
    ],
    fields: [],
    implements: [],
    isExtend: false,
    name: "PageInfo",
    superTypes: [],
    $resolvedFields: []
  } as ApiModel;

  const pageInfoHasNextPageField: DataModelField = {
    $container: pageInfo,
    $type: "DataModelField",
    attributes: [],
    comments: [],
    name: "hasNextPage",
    type: undefined
  };
  pageInfoHasNextPageField.type = {
    $container: pageInfoHasNextPageField,
    $type: "DataModelFieldType",
    array: false,
    optional: false,
    type: "Boolean"
  } as DataModelFieldType;
  pageInfo.fields.push(pageInfoHasNextPageField);

  const pageInfoHasPreviousPageField: DataModelField = {
    $container: pageInfo,
    $type: "DataModelField",
    attributes: [],
    comments: [],
    name: "hasPreviousPage",
    type: undefined
  };
  pageInfoHasPreviousPageField.type = {
    $container: pageInfoHasPreviousPageField,
    $type: "DataModelFieldType",
    array: false,
    optional: false,
    type: "Boolean"
  } as DataModelFieldType;
  pageInfo.fields.push(pageInfoHasPreviousPageField);

  const pageInfoStartCursorField: DataModelField = {
    $container: pageInfo,
    $type: "DataModelField",
    attributes: [],
    comments: [],
    name: "startCursor",
    type: undefined
  };
  pageInfoStartCursorField.type = {
    $container: pageInfoStartCursorField,
    $type: "DataModelFieldType",
    array: false,
    optional: false,
    type: "String"
  } as DataModelFieldType;
  pageInfo.fields.push(pageInfoStartCursorField);

  const pageInfoEndCursorField: DataModelField = {
    $container: pageInfo,
    $type: "DataModelField",
    attributes: [],
    comments: [],
    name: "endCursor",
    type: undefined
  };
  pageInfoEndCursorField.type = {
    $container: pageInfoEndCursorField,
    $type: "DataModelFieldType",
    array: false,
    optional: false,
    type: "String"
  } as DataModelFieldType;
  pageInfo.fields.push(pageInfoEndCursorField);

  apiModels.push(pageInfo);

  dataModels.forEach(dataModel => {
    const selectObjectSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `${dataModel.name}SelectObjectSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    dataModel.fields.forEach(field => {
      const selectField: DataModelField = {
        name: field.name,
        "$container": selectObjectSchema,
        "$type": "DataModelField",
        attributes: [],
        comments: [],
        type: undefined
      };
      selectField.type = {
        $container: selectField,
        $type: "DataModelFieldType",
        array: false,
        optional: true,
        type: "Boolean"
      } as DataModelFieldType;
      selectObjectSchema.fields.push(selectField);
    });

    const countSelectField: DataModelField = {
      name: "_count",
      "$container": selectObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    countSelectField.type = {
      $container: countSelectField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      type: "Boolean"
    } as DataModelFieldType;

    selectObjectSchema.fields.push(countSelectField);
    inputs.push(selectObjectSchema);

    const includeObjectSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `${dataModel.name}IncludeObjectSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    dataModel.fields
      .filter(field => isDataModel(field.type.reference?.ref))
      .forEach(field => {
        const includeField: DataModelField = {
          name: field.name,
          "$container": includeObjectSchema,
          "$type": "DataModelField",
          attributes: [],
          comments: [],
          type: undefined
        };
        includeField.type = {
          $container: includeField,
          $type: "DataModelFieldType",
          array: false,
          optional: true,
          type: "Boolean"
        } as DataModelFieldType;
        includeObjectSchema.fields.push(includeField);
      });

    const countIncludeField: DataModelField = {
      name: "_count",
      "$container": includeObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    countIncludeField.type = {
      $container: countIncludeField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      type: "Boolean"
    } as DataModelFieldType;

    includeObjectSchema.fields.push(countIncludeField);
    inputs.push(includeObjectSchema);

    const whereManyInputObjectSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `${dataModel.name}WhereManyInputObjectSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    const whereManyInputObjectSchemaAndField: DataModelField = {
      name: "AND",
      "$container": whereManyInputObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    whereManyInputObjectSchemaAndField.type = {
      $container: whereManyInputObjectSchemaAndField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereManyInputObjectSchema,
        $refText: "whereManyInputObjectSchema"
      }
    };
    whereManyInputObjectSchema.fields.push(whereManyInputObjectSchemaAndField);

    const whereManyInputObjectSchemaOrField: DataModelField = {
      name: "OR",
      "$container": whereManyInputObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    whereManyInputObjectSchemaOrField.type = {
      $container: whereManyInputObjectSchemaOrField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereManyInputObjectSchema,
        $refText: "whereManyInputObjectSchema"
      }
    };
    whereManyInputObjectSchema.fields.push(whereManyInputObjectSchemaOrField);

    const whereManyInputObjectSchemaNotField: DataModelField = {
      name: "NOT",
      "$container": whereManyInputObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    whereManyInputObjectSchemaNotField.type = {
      $container: whereManyInputObjectSchemaNotField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereManyInputObjectSchema,
        $refText: "whereManyInputObjectSchema"
      }
    };
    whereManyInputObjectSchema.fields.push(whereManyInputObjectSchemaNotField);

    dataModel.fields.forEach(field => {
      if (field.type.type === "DateTime") {
        const whereInputObjectSchemaDateTimeField: DataModelField = {
          name: field.name,
          "$container": whereManyInputObjectSchema,
          "$type": "DataModelField",
          attributes: [],
          comments: [],
          type: undefined
        };
        whereInputObjectSchemaDateTimeField.type = {
          $container: whereInputObjectSchemaDateTimeField,
          $type: "DataModelFieldType",
          array: false,
          optional: true,
          reference: { ref: dateTimeFilter, $refText: "dateTimeFilter" }
        };
        whereManyInputObjectSchema.fields.push(
          whereInputObjectSchemaDateTimeField
        );
      } else if (field.type.type === "Boolean") {
        const whereInputObjectSchemaBooleanField: DataModelField = {
          name: field.name,
          "$container": whereManyInputObjectSchema,
          "$type": "DataModelField",
          attributes: [],
          comments: [],
          type: undefined
        };
        whereInputObjectSchemaBooleanField.type = {
          $container: whereInputObjectSchemaBooleanField,
          $type: "DataModelFieldType",
          array: false,
          optional: true,
          reference: { ref: boolFilter, $refText: "boolFilter" }
        };
        whereManyInputObjectSchema.fields.push(
          whereInputObjectSchemaBooleanField
        );
      } else {
        const whereInputObjectSchemaStringField: DataModelField = {
          name: field.name,
          "$container": whereManyInputObjectSchema,
          "$type": "DataModelField",
          attributes: [],
          comments: [],
          type: undefined
        };
        whereInputObjectSchemaStringField.type = {
          $container: whereInputObjectSchemaStringField,
          $type: "DataModelFieldType",
          array: false,
          optional: true,
          reference: { ref: stringFilter, $refText: "stringFilter" }
        };
        whereManyInputObjectSchema.fields.push(
          whereInputObjectSchemaStringField
        );
      }
    });

    inputs.push(whereManyInputObjectSchema);

    const whereUniqueInputObjectSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `${dataModel.name}WhereUniqueInputObjectSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    const whereUniqueInputObjectSchemaIdField: DataModelField = {
      name: "id",
      "$container": whereUniqueInputObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    whereUniqueInputObjectSchemaIdField.type = {
      $container: whereUniqueInputObjectSchemaIdField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      type: "String"
    };
    whereUniqueInputObjectSchema.fields.push(
      whereUniqueInputObjectSchemaIdField
    );

    const whereUniqueInputObjectSchemaAndField: DataModelField = {
      name: "AND",
      "$container": whereUniqueInputObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    whereUniqueInputObjectSchemaAndField.type = {
      $container: whereUniqueInputObjectSchemaAndField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereUniqueInputObjectSchema,
        $refText: "whereUniqueInputObjectSchema"
      }
    };
    whereUniqueInputObjectSchema.fields.push(
      whereUniqueInputObjectSchemaAndField
    );

    const whereUniqueInputObjectSchemaOrField: DataModelField = {
      name: "OR",
      "$container": whereUniqueInputObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    whereUniqueInputObjectSchemaOrField.type = {
      $container: whereUniqueInputObjectSchemaOrField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereUniqueInputObjectSchema,
        $refText: "whereUniqueInputObjectSchema"
      }
    };
    whereUniqueInputObjectSchema.fields.push(
      whereUniqueInputObjectSchemaOrField
    );

    const whereUniqueInputObjectSchemaNotField: DataModelField = {
      name: "NOT",
      "$container": whereUniqueInputObjectSchema,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    whereUniqueInputObjectSchemaNotField.type = {
      $container: whereUniqueInputObjectSchemaNotField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereUniqueInputObjectSchema,
        $refText: "whereUniqueInputObjectSchema"
      }
    };
    whereUniqueInputObjectSchema.fields.push(
      whereUniqueInputObjectSchemaNotField
    );

    dataModel.fields.forEach(field => {
      if (field.name !== "id") {
        if (field.type.type === "DateTime") {
          const whereInputObjectSchemaDateTimeField: DataModelField = {
            name: field.name,
            "$container": whereUniqueInputObjectSchema,
            "$type": "DataModelField",
            attributes: [],
            comments: [],
            type: undefined
          };
          whereInputObjectSchemaDateTimeField.type = {
            $container: whereInputObjectSchemaDateTimeField,
            $type: "DataModelFieldType",
            array: false,
            optional: true,
            reference: { ref: dateTimeFilter, $refText: "dateTimeFilter" }
          };
          whereUniqueInputObjectSchema.fields.push(
            whereInputObjectSchemaDateTimeField
          );
        } else if (field.type.type === "Boolean") {
          const whereInputObjectSchemaBooleanField: DataModelField = {
            name: field.name,
            "$container": whereUniqueInputObjectSchema,
            "$type": "DataModelField",
            attributes: [],
            comments: [],
            type: undefined
          };
          whereInputObjectSchemaBooleanField.type = {
            $container: whereInputObjectSchemaBooleanField,
            $type: "DataModelFieldType",
            array: false,
            optional: true,
            reference: { ref: boolFilter, $refText: "boolFilter" }
          };
          whereUniqueInputObjectSchema.fields.push(
            whereInputObjectSchemaBooleanField
          );
        } else {
          const whereInputObjectSchemaStringField: DataModelField = {
            name: field.name,
            "$container": whereUniqueInputObjectSchema,
            "$type": "DataModelField",
            attributes: [],
            comments: [],
            type: undefined
          };
          whereInputObjectSchemaStringField.type = {
            $container: whereInputObjectSchemaStringField,
            $type: "DataModelFieldType",
            array: false,
            optional: true,
            reference: { ref: stringFilter, $refText: "stringFilter" }
          };
          whereUniqueInputObjectSchema.fields.push(
            whereInputObjectSchemaStringField
          );
        }
      }
    });

    inputs.push(whereUniqueInputObjectSchema);

    const orderByObjectSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `${dataModel.name}OrderByObjectSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    dataModel.fields.forEach(field => {
      const orderByObjectSchemaField: DataModelField = {
        name: field.name,
        "$container": orderByObjectSchema,
        "$type": "DataModelField",
        attributes: [],
        comments: [],
        type: undefined
      };
      orderByObjectSchemaField.type = {
        $container: orderByObjectSchemaField,
        $type: "DataModelFieldType",
        array: false,
        optional: true,
        reference: {
          ref: sortOrderEnum,
          $refText: "sortOrderEnum"
        }
      };
      orderByObjectSchema.fields.push(orderByObjectSchemaField);
    });

    inputs.push(orderByObjectSchema);

    const modelFieldEnum: Enum = {
      name: `${upperCaseFirst(dataModel.name)}Field`,
      $container: rootContainer,
      $type: "Enum",
      attributes: [],
      comments: [],
      fields: []
    };

    dataModel.fields.forEach(field => {
      const modelFieldEnumField: EnumField = {
        name: constantCase(field.name),
        $container: modelFieldEnum,
        $type: "EnumField",
        attributes: [],
        comments: []
      };
      modelFieldEnum.fields.push(modelFieldEnumField);
    });

    enums.push(modelFieldEnum);

    // Add "FindUnique" selector input
    const findUniqueSelectorInput: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `${upperCaseFirst(dataModel.name)}SelectorInput`,
      superTypes: [],
      $resolvedFields: []
    };

    const findUniqueSelectField: DataModelField = {
      name: "select",
      "$container": findUniqueSelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findUniqueSelectField.type = {
      $container: findUniqueSelectField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: selectObjectSchema,
        $refText: "selectObjectSchema"
      }
    } as DataModelFieldType;
    findUniqueSelectorInput.fields.push(findUniqueSelectField);

    const findUniqueIncludeField: DataModelField = {
      name: "include",
      "$container": findUniqueSelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findUniqueIncludeField.type = {
      $container: findUniqueIncludeField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: includeObjectSchema,
        $refText: "includeObjectSchema"
      }
    } as DataModelFieldType;
    findUniqueSelectorInput.fields.push(findUniqueIncludeField);

    const findUniqueWhereField: DataModelField = {
      name: "where",
      "$container": findUniqueSelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findUniqueWhereField.type = {
      $container: findUniqueWhereField,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: whereUniqueInputObjectSchema,
        $refText: "whereUniqueInputObjectSchema"
      }
    } as DataModelFieldType;
    findUniqueSelectorInput.fields.push(findUniqueWhereField);

    inputs.push(findUniqueSelectorInput);

    // Add "FindMany" selector input
    const findManySelectorInput: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `${upperCaseFirst(dataModel.name)}sSelectorInput`,
      superTypes: [],
      $resolvedFields: []
    };

    const findManySelectField: DataModelField = {
      name: "select",
      "$container": findManySelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findManySelectField.type = {
      $container: findManySelectField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: selectObjectSchema,
        $refText: "selectObjectSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManySelectField);

    const findManyIncludeField: DataModelField = {
      name: "include",
      "$container": findManySelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findManyIncludeField.type = {
      $container: findManyIncludeField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: includeObjectSchema,
        $refText: "includeObjectSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyIncludeField);

    const findManyWhereField: DataModelField = {
      name: "where",
      "$container": findManySelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findManyWhereField.type = {
      $container: findManyWhereField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: whereManyInputObjectSchema,
        $refText: "whereManyInputObjectSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyWhereField);

    const findManyOrderByField: DataModelField = {
      name: "orderBy",
      "$container": findManySelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findManyOrderByField.type = {
      $container: findManyOrderByField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: orderByObjectSchema,
        $refText: "orderByObjectSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyOrderByField);

    const findManyCursorField: DataModelField = {
      name: "cursor",
      "$container": findManySelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findManyCursorField.type = {
      $container: findManyCursorField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: whereUniqueInputObjectSchema,
        $refText: "whereUniqueInputObjectSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyCursorField);

    const findManyTakeField: DataModelField = {
      name: "take",
      "$container": findManySelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findManyTakeField.type = {
      $container: findManyTakeField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      type: "Int"
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyTakeField);

    const findManySkipField: DataModelField = {
      name: "skip",
      "$container": findManySelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findManySkipField.type = {
      $container: findManySkipField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      type: "Int"
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManySkipField);

    const findManyDistinctField: DataModelField = {
      name: "distinct",
      "$container": findManySelectorInput,
      "$type": "DataModelField",
      attributes: [],
      comments: [],
      type: undefined
    };
    findManyDistinctField.type = {
      $container: findManyDistinctField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: modelFieldEnum,
        $refText: "modelFieldEnum"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyDistinctField);

    inputs.push(findManySelectorInput);

    const findUniqueOperation: Operation = {
      $container: queryOperationGroup,
      $type: "Operation",
      attributes: [],
      comments: [],
      params: [],
      name: `${lowerCaseFirst(dataModel.name)}`,
      resultType: undefined
    };
    findUniqueOperation.resultType = {
      $container: findUniqueOperation,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: dataModel,
        $refText: dataModel.name
      }
    } as DataModelFieldType;

    const findUniqueOperationParam: OperationInputParam = {
      $container: findUniqueOperation,
      $type: "OperationInputParam",
      default: false,
      name: "selector",
      type: undefined
    };
    findUniqueOperationParam.type = {
      $container: findUniqueOperationParam,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: findUniqueSelectorInput,
        $refText: "selectorInput"
      }
    } as DataModelFieldType;

    findUniqueOperation.params.push(findUniqueOperationParam);
    queryOperationGroup.fields.push(findUniqueOperation);

    const edgeObjectSchema = {
      $container: rootContainer,
      $type: "ApiModel",
      attributes: [],
      comments: [
        `An object containing the current paginated result data returned from ${dataModel.name} at the current cursor position`
      ],
      fields: [],
      implements: [],
      isExtend: false,
      name: `${upperCaseFirst(dataModel.name)}Edge`,
      superTypes: [],
      $resolvedFields: []
    } as ApiModel;

    const edgeNodeObjectSchema: DataModelField = {
      $container: edgeObjectSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "node",
      type: undefined
    };
    edgeNodeObjectSchema.type = {
      $container: edgeNodeObjectSchema,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: dataModel,
        $refText: dataModel.name
      }
    } as DataModelFieldType;
    edgeObjectSchema.fields.push(edgeNodeObjectSchema);

    const edgeCursorObjectSchema: DataModelField = {
      $container: edgeObjectSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "cursor",
      type: undefined
    };
    edgeCursorObjectSchema.type = {
      $container: edgeCursorObjectSchema,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      type: "String"
    } as DataModelFieldType;
    edgeObjectSchema.fields.push(edgeCursorObjectSchema);

    apiModels.push(edgeObjectSchema);

    const connectionObjectSchema = {
      $container: rootContainer,
      $type: "ApiModel",
      attributes: [],
      comments: [
        `An object containing the paginated child model data returned from ${dataModel.name}`
      ],
      fields: [],
      implements: [],
      isExtend: false,
      name: `${upperCaseFirst(dataModel.name)}Connection`,
      superTypes: [],
      $resolvedFields: []
    } as ApiModel;

    const connectionEdgesObjectSchema: DataModelField = {
      $container: connectionObjectSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "edges",
      type: undefined
    };
    connectionEdgesObjectSchema.type = {
      $container: connectionEdgesObjectSchema,
      $type: "DataModelFieldType",
      array: true,
      optional: false,
      reference: {
        ref: edgeObjectSchema,
        $refText: edgeObjectSchema.name
      }
    } as DataModelFieldType;
    connectionObjectSchema.fields.push(connectionEdgesObjectSchema);

    const connectionPageInfoObjectSchema: DataModelField = {
      $container: connectionObjectSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "pageInfo",
      type: undefined
    };
    connectionPageInfoObjectSchema.type = {
      $container: connectionPageInfoObjectSchema,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: pageInfo,
        $refText: pageInfo.name
      }
    } as DataModelFieldType;
    connectionObjectSchema.fields.push(connectionPageInfoObjectSchema);

    const connectionTotalCountObjectSchema: DataModelField = {
      $container: connectionObjectSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "totalCount",
      type: undefined
    };
    connectionTotalCountObjectSchema.type = {
      $container: connectionTotalCountObjectSchema,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      type: "Int"
    } as DataModelFieldType;
    connectionObjectSchema.fields.push(connectionTotalCountObjectSchema);

    apiModels.push(connectionObjectSchema);

    const findManyOperation: Operation = {
      $container: queryOperationGroup,
      $type: "Operation",
      attributes: [],
      comments: [],
      params: [],
      name: `${lowerCaseFirst(dataModel.name)}s`,
      resultType: undefined
    };
    findManyOperation.resultType = {
      $container: findManyOperation,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: connectionObjectSchema,
        $refText: connectionObjectSchema.name
      }
    } as DataModelFieldType;

    const findManyOperationParam: OperationInputParam = {
      $container: findManyOperation,
      $type: "OperationInputParam",
      default: false,
      name: "selector",
      type: undefined
    };
    findManyOperationParam.type = {
      $container: findManyOperationParam,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: findManySelectorInput,
        $refText: "selectorInput"
      }
    } as DataModelFieldType;

    findManyOperation.params.push(findManyOperationParam);
    queryOperationGroup.fields.push(findManyOperation);
  });

  inputs.push(dateTimeFilter);
  inputs.push(boolFilter);
  inputs.push(stringFilter);

  const generator = new SchemaGenerator();

  const sfSchema = project.createSourceFile(
    join(output, "schema.graphql"),
    undefined,
    {
      overwrite: true
    }
  );
  sfSchema.replaceWithText(writer => {
    /*writer.writeLine(`"""`);
    writer.writeLine(getFileHeader("GraphQL Schema", ""));
    writer.writeLine(`"""`);*/

    generateInterfaceSchemas(project, interfaces, writer, generator);
    generateEnumSchemas(project, enums, writer, generator);
    generateOperationSchemas(
      project,
      operationGroups,

      writer,
      generator
    );
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

  // emit
  const shouldCompile = options.compile !== false;
  if (!shouldCompile || options.preserveTsFiles === true) {
    // save ts files
    await saveProject(project);
  }
  if (shouldCompile) {
    await emitProject(project);
  }

  const schema = await loadSchema(join(output, "**/*.graphql"), {
    loaders: [new GraphQLFileLoader()]
  });
  if (schema) {
    const typesDir = join(output, "types");
    if (!existsSync(typesDir)) {
      await mkdir(typesDir);
    }

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
            futureProofUnions: true
          }
        }
      ],
      pluginMap: {
        typescript: typescriptPlugin
      }
    });
    await fs.writeFile(
      join(output, "types", "schema-types.ts"),
      await formatString(`/* eslint-disable */
${getFileHeader("GraphQL Schema", "//")}

${typesOutput}`),
      "utf8"
    );

    const resolversOutput = await codegen({
      documents: [],
      config: {},
      filename: join(typesDir, "resolvers-types.ts"),
      schema: parse(printSchema(schema)),
      plugins: [
        {
          typescriptResolvers: {
            contextType: "GraphQLServerContext"
          }
        }
      ],
      pluginMap: {
        typescriptResolvers: typescriptResolversPlugin
      }
    });
    await fs.writeFile(
      join(output, "types", "resolvers-types.ts"),
      await formatString(`/* eslint-disable */
${getFileHeader("GraphQL Schema", "//")}

import { GraphQLServerContext } from "@open-system/core-server-graphql/context";
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
  writer.writeLine("");
  writer.writeLine(generator.getScalarsImport());
  writer.writeLine('import { Resolvers } from "./types"');
  writer.writeLine("");

  writer.writeLine("export const resolvers: Resolvers = {");
  writer.write(`${generator.getScalarsResolvers()},`);

  const queryOperationGroup = operationGroups.find(
    operationGroup => operationGroup.name === "Query"
  );
  if (queryOperationGroup) {
    writer.writeLine(`${queryOperationGroup.name}: {`);

    queryOperationGroup.fields.forEach(operation => {
      writer.writeLine(`async ${operation.name}(root, args, ctx, info) {`);

      writer.writeLine("}");
    });

    writer.writeLine("}");
  }

  const mutationOperationGroup = operationGroups.find(
    operationGroup => operationGroup.name === "Mutation"
  );
  if (mutationOperationGroup) {
    writer.writeLine(`${mutationOperationGroup.name}: {`);

    mutationOperationGroup.fields.forEach(operation => {
      writer.writeLine(`async ${operation.name}(root, args, ctx, info) {`);

      writer.writeLine("}");
    });

    writer.writeLine("}");
  }

  writer.writeLine("}");
  writer.writeLine("");
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
