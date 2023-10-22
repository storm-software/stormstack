import {
  constantCase,
  lowerCaseFirst,
  upperCaseFirst
} from "@stormstack/core-shared-utilities";
import {
  Context,
  PluginExtend,
  PluginOptions,
  getApiModels,
  getDataModels,
  getInputs,
  getInterfaces,
  getOperationGroups
} from "@stormstack/tools-forecast-codegen";
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
  isDataModel,
  isEnum
} from "@stormstack/tools-forecast-language/ast";
import { ENTITY_CLASS_FIELDS, EntityClassFields } from "./types";

export const name = "CRUD Operations Extension";

export const extend: PluginExtend<PluginOptions> = async (
  options: PluginOptions,
  context: Context
): Promise<Model> => {
  const model = context.model;

  const dataModels = getDataModels(model);
  let operationGroups = getOperationGroups(model);
  const inputs = getInputs(model);
  const apiModels = getApiModels(model);
  const interfaces = getInterfaces(model);

  const enums: Enum[] = model.declarations.reduce((ret, decl) => {
    if (decl.$type === Enum) {
      ret.push(decl as Enum);
    }

    return ret;
  }, []);

  operationGroups = addDefaultOperationGroups(
    model,
    apiModels,
    operationGroups
  );

  addQueries(
    model,
    dataModels,
    operationGroups,
    inputs,
    apiModels,
    interfaces,
    enums
  );

  addMutations(
    model,
    dataModels,
    operationGroups,
    inputs,
    apiModels,
    interfaces,
    enums
  );

  return model;
};

const addDefaultOperationGroups = (
  model: Model,
  apiModels: ApiModel[],
  operationGroups: OperationGroup[]
): OperationGroup[] => {
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

  return operationGroups;
};

const addQueries = (
  model: Model,
  dataModels: DataModel[],
  operationGroups: OperationGroup[],
  inputs: Input[],
  apiModels: ApiModel[],
  interfaces: Interface[],
  enums: Enum[]
) => {
  const rootContainer =
    apiModels.length > 0 ? apiModels[0].$container : undefined;

  const queryOperationGroup: OperationGroup = operationGroups.find(
    operationGroup => operationGroup.name === "Query"
  );

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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: stringFilter,
    $type: "DataModelField",
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
    $container: dateTimeFilter,
    $type: "DataModelField",
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
    $container: dateTimeFilter,
    $type: "DataModelField",
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
    $container: dateTimeFilter,
    $type: "DataModelField",
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
    $container: dateTimeFilter,
    $type: "DataModelField",
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
    $container: dateTimeFilter,
    $type: "DataModelField",
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
    $container: dateTimeFilter,
    $type: "DataModelField",
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
    $container: dateTimeFilter,
    $type: "DataModelField",
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
    $container: dateTimeFilter,
    $type: "DataModelField",
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
    $container: boolFilter,
    $type: "DataModelField",
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
    $container: boolFilter,
    $type: "DataModelField",
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
    comments: ["When paginating forwards, are there more items?"],
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
    comments: ["When paginating backwards, are there more items?"],
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
    comments: ["When paginating backwards, the cursor to continue."],
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
    comments: ["When paginating forwards, the cursor to continue."],
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
    const selectSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [
        `Select specific fields to fetch from the ${dataModel.name} data model`
      ],
      fields: [],
      name: `${dataModel.name}SelectSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    dataModel.fields.forEach(field => {
      const selectField: DataModelField = {
        name: field.name,
        $container: selectSchema,
        $type: "DataModelField",
        attributes: [],
        comments: [`Include the ${field.name} field in the result set`],
        type: undefined
      };
      selectField.type = {
        $container: selectField,
        $type: "DataModelFieldType",
        array: false,
        optional: true,
        type: "Boolean"
      } as DataModelFieldType;

      selectSchema.fields.push(selectField);
    });

    const countSelectField: DataModelField = {
      name: "_count",
      $container: selectSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Include the count of items in the result set"],
      type: undefined
    };
    countSelectField.type = {
      $container: countSelectField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      type: "Boolean"
    } as DataModelFieldType;

    selectSchema.fields.push(countSelectField);
    inputs.push(selectSchema);

    const includeSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [
        "Include specific sub-model fields from the related data models"
      ],
      fields: [],
      name: `${dataModel.name}IncludeSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    dataModel.fields
      .filter(field => isDataModel(field.type.reference?.ref))
      .forEach(field => {
        const includeField: DataModelField = {
          name: field.name,
          $container: includeSchema,
          $type: "DataModelField",
          attributes: [],
          comments: [`Include the related ${field.name} data model`],
          type: undefined
        };
        includeField.type = {
          $container: includeField,
          $type: "DataModelFieldType",
          array: false,
          optional: true,
          type: "Boolean"
        } as DataModelFieldType;
        includeSchema.fields.push(includeField);
      });

    const countIncludeField: DataModelField = {
      name: "_count",
      $container: includeSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Include the count of items in the result set"],
      type: undefined
    };
    countIncludeField.type = {
      $container: countIncludeField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      type: "Boolean"
    } as DataModelFieldType;

    includeSchema.fields.push(countIncludeField);
    inputs.push(includeSchema);

    const whereManyInputSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: ["Filter the result set"],
      fields: [],
      name: `${dataModel.name}WhereManyInputSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    const whereManyInputSchemaAndField: DataModelField = {
      name: "AND",
      $container: whereManyInputSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Combine multiple filters with the AND operator"],
      type: undefined
    };
    whereManyInputSchemaAndField.type = {
      $container: whereManyInputSchemaAndField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereManyInputSchema,
        $refText: "whereManyInputSchema"
      }
    };
    whereManyInputSchema.fields.push(whereManyInputSchemaAndField);

    const whereManyInputSchemaOrField: DataModelField = {
      name: "OR",
      $container: whereManyInputSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Combine multiple filters with the OR operator"],
      type: undefined
    };
    whereManyInputSchemaOrField.type = {
      $container: whereManyInputSchemaOrField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereManyInputSchema,
        $refText: "whereManyInputSchema"
      }
    };
    whereManyInputSchema.fields.push(whereManyInputSchemaOrField);

    const whereManyInputSchemaNotField: DataModelField = {
      name: "NOT",
      $container: whereManyInputSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Negate a filter with the NOT operator"],
      type: undefined
    };
    whereManyInputSchemaNotField.type = {
      $container: whereManyInputSchemaNotField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereManyInputSchema,
        $refText: "whereManyInputSchema"
      }
    };
    whereManyInputSchema.fields.push(whereManyInputSchemaNotField);

    dataModel.fields.forEach(field => {
      if (field.type.type === "DateTime") {
        const whereInputSchemaDateTimeField: DataModelField = {
          name: field.name,
          $container: whereManyInputSchema,
          $type: "DataModelField",
          attributes: [],
          comments: ["Filter by the date and time"],
          type: undefined
        };
        whereInputSchemaDateTimeField.type = {
          $container: whereInputSchemaDateTimeField,
          $type: "DataModelFieldType",
          array: false,
          optional: true,
          reference: { ref: dateTimeFilter, $refText: "dateTimeFilter" }
        };
        whereManyInputSchema.fields.push(whereInputSchemaDateTimeField);
      } else if (field.type.type === "Boolean") {
        const whereInputSchemaBooleanField: DataModelField = {
          name: field.name,
          $container: whereManyInputSchema,
          $type: "DataModelField",
          attributes: [],
          comments: [`Filter by the ${field.name} boolean value`],
          type: undefined
        };
        whereInputSchemaBooleanField.type = {
          $container: whereInputSchemaBooleanField,
          $type: "DataModelFieldType",
          array: false,
          optional: true,
          reference: { ref: boolFilter, $refText: "boolFilter" }
        };
        whereManyInputSchema.fields.push(whereInputSchemaBooleanField);
      } else {
        const whereInputSchemaStringField: DataModelField = {
          name: field.name,
          $container: whereManyInputSchema,
          $type: "DataModelField",
          attributes: [],
          comments: [`Filter by the ${field.name} string value`],
          type: undefined
        };
        whereInputSchemaStringField.type = {
          $container: whereInputSchemaStringField,
          $type: "DataModelFieldType",
          array: false,
          optional: true,
          reference: { ref: stringFilter, $refText: "stringFilter" }
        };
        whereManyInputSchema.fields.push(whereInputSchemaStringField);
      }
    });

    inputs.push(whereManyInputSchema);

    const whereUniqueInputSchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: ["Filter the result set"],
      fields: [],
      name: `${dataModel.name}WhereUniqueInputSchema`,
      superTypes: [],
      $resolvedFields: []
    };

    const whereUniqueInputSchemaIdField: DataModelField = {
      name: "id",
      $container: whereUniqueInputSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Filter by the unique identifier"],
      type: undefined
    };
    whereUniqueInputSchemaIdField.type = {
      $container: whereUniqueInputSchemaIdField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      type: "String"
    };
    whereUniqueInputSchema.fields.push(whereUniqueInputSchemaIdField);

    const whereUniqueInputSchemaAndField: DataModelField = {
      name: "AND",
      $container: whereUniqueInputSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Combine multiple filters with the AND operator"],
      type: undefined
    };
    whereUniqueInputSchemaAndField.type = {
      $container: whereUniqueInputSchemaAndField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereUniqueInputSchema,
        $refText: "whereUniqueInputSchema"
      }
    };
    whereUniqueInputSchema.fields.push(whereUniqueInputSchemaAndField);

    const whereUniqueInputSchemaOrField: DataModelField = {
      name: "OR",
      $container: whereUniqueInputSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Combine multiple filters with the OR operator"],
      type: undefined
    };
    whereUniqueInputSchemaOrField.type = {
      $container: whereUniqueInputSchemaOrField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereUniqueInputSchema,
        $refText: "whereUniqueInputSchema"
      }
    };
    whereUniqueInputSchema.fields.push(whereUniqueInputSchemaOrField);

    const whereUniqueInputSchemaNotField: DataModelField = {
      name: "NOT",
      $container: whereUniqueInputSchema,
      $type: "DataModelField",
      attributes: [],
      comments: ["Negate a filter with the NOT operator"],
      type: undefined
    };
    whereUniqueInputSchemaNotField.type = {
      $container: whereUniqueInputSchemaNotField,
      $type: "DataModelFieldType",
      array: true,
      optional: true,
      reference: {
        ref: whereUniqueInputSchema,
        $refText: "whereUniqueInputSchema"
      }
    };
    whereUniqueInputSchema.fields.push(whereUniqueInputSchemaNotField);

    dataModel.fields.forEach(field => {
      if (field.name !== "id") {
        if (field.type.type === "DateTime") {
          const whereInputSchemaDateTimeField: DataModelField = {
            name: field.name,
            $container: whereUniqueInputSchema,
            $type: "DataModelField",
            attributes: [],
            comments: [`Filter by the ${field.name} date and time`],
            type: undefined
          };
          whereInputSchemaDateTimeField.type = {
            $container: whereInputSchemaDateTimeField,
            $type: "DataModelFieldType",
            array: false,
            optional: true,
            reference: { ref: dateTimeFilter, $refText: "dateTimeFilter" }
          };
          whereUniqueInputSchema.fields.push(whereInputSchemaDateTimeField);
        } else if (field.type.type === "Boolean") {
          const whereInputSchemaBooleanField: DataModelField = {
            name: field.name,
            $container: whereUniqueInputSchema,
            $type: "DataModelField",
            attributes: [],
            comments: [`Filter by the ${field.name} boolean value`],
            type: undefined
          };
          whereInputSchemaBooleanField.type = {
            $container: whereInputSchemaBooleanField,
            $type: "DataModelFieldType",
            array: false,
            optional: true,
            reference: { ref: boolFilter, $refText: "boolFilter" }
          };
          whereUniqueInputSchema.fields.push(whereInputSchemaBooleanField);
        } else {
          const whereInputSchemaStringField: DataModelField = {
            name: field.name,
            $container: whereUniqueInputSchema,
            $type: "DataModelField",
            attributes: [],
            comments: [`Filter by the ${field.name} string value`],
            type: undefined
          };
          whereInputSchemaStringField.type = {
            $container: whereInputSchemaStringField,
            $type: "DataModelFieldType",
            array: false,
            optional: true,
            reference: { ref: stringFilter, $refText: "stringFilter" }
          };
          whereUniqueInputSchema.fields.push(whereInputSchemaStringField);
        }
      }
    });

    inputs.push(whereUniqueInputSchema);

    const orderBySchema: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `${dataModel.name}OrderBySchema`,
      superTypes: [],
      $resolvedFields: []
    };

    dataModel.fields.forEach(field => {
      const orderBySchemaField: DataModelField = {
        name: field.name,
        $container: orderBySchema,
        $type: "DataModelField",
        attributes: [],
        comments: ["Sort the result set"],
        type: undefined
      };
      orderBySchemaField.type = {
        $container: orderBySchemaField,
        $type: "DataModelFieldType",
        array: false,
        optional: true,
        reference: {
          ref: sortOrderEnum,
          $refText: "sortOrderEnum"
        }
      };
      orderBySchema.fields.push(orderBySchemaField);
    });

    inputs.push(orderBySchema);

    const modelFieldEnum: Enum = {
      name: `${upperCaseFirst(dataModel.name)}Field`,
      $container: rootContainer,
      $type: "Enum",
      attributes: [],
      comments: [`The fields of the ${dataModel.name} enum model`],
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
      comments: ["Find a single record by the unique identifier"],
      fields: [],
      name: `${upperCaseFirst(dataModel.name)}SelectorInput`,
      superTypes: [],
      $resolvedFields: []
    };

    const findUniqueSelectField: DataModelField = {
      name: "select",
      $container: findUniqueSelectorInput,
      $type: "DataModelField",
      attributes: [],
      comments: [
        `Select specific fields to fetch from the ${dataModel.name} data model`
      ],
      type: undefined
    };
    findUniqueSelectField.type = {
      $container: findUniqueSelectField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: selectSchema,
        $refText: "selectSchema"
      }
    } as DataModelFieldType;
    findUniqueSelectorInput.fields.push(findUniqueSelectField);

    const findUniqueIncludeField: DataModelField = {
      name: "include",
      $container: findUniqueSelectorInput,
      $type: "DataModelField",
      attributes: [],
      comments: [
        `Include specific ${dataModel.name} sub-model fields from the related data models`
      ],
      type: undefined
    };
    findUniqueIncludeField.type = {
      $container: findUniqueIncludeField,
      $type: "DataModelFieldType",
      array: false,
      optional: true,
      reference: {
        ref: includeSchema,
        $refText: "includeSchema"
      }
    } as DataModelFieldType;
    findUniqueSelectorInput.fields.push(findUniqueIncludeField);

    const findUniqueWhereField: DataModelField = {
      name: "where",
      $container: findUniqueSelectorInput,
      $type: "DataModelField",
      attributes: [],
      comments: [`Filter the ${dataModel.name} result set`],
      type: undefined
    };
    findUniqueWhereField.type = {
      $container: findUniqueWhereField,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: whereUniqueInputSchema,
        $refText: "whereUniqueInputSchema"
      }
    } as DataModelFieldType;
    findUniqueSelectorInput.fields.push(findUniqueWhereField);

    inputs.push(findUniqueSelectorInput);

    // Add "FindMany" selector input
    const findManySelectorInput: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [`Find multiple ${dataModel.name} records`],
      fields: [],
      name: `${upperCaseFirst(dataModel.name)}sSelectorInput`,
      superTypes: [],
      $resolvedFields: []
    };

    const findManySelectField: DataModelField = {
      name: "select",
      $container: findManySelectorInput,
      $type: "DataModelField",
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
        ref: selectSchema,
        $refText: "selectSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManySelectField);

    const findManyIncludeField: DataModelField = {
      name: "include",
      $container: findManySelectorInput,
      $type: "DataModelField",
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
        ref: includeSchema,
        $refText: "includeSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyIncludeField);

    const findManyWhereField: DataModelField = {
      name: "where",
      $container: findManySelectorInput,
      $type: "DataModelField",
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
        ref: whereManyInputSchema,
        $refText: "whereManyInputSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyWhereField);

    const findManyOrderByField: DataModelField = {
      name: "orderBy",
      $container: findManySelectorInput,
      $type: "DataModelField",
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
        ref: orderBySchema,
        $refText: "orderBySchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyOrderByField);

    const findManyCursorField: DataModelField = {
      name: "cursor",
      $container: findManySelectorInput,
      $type: "DataModelField",
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
        ref: whereUniqueInputSchema,
        $refText: "whereUniqueInputSchema"
      }
    } as DataModelFieldType;
    findManySelectorInput.fields.push(findManyCursorField);

    const findManyTakeField: DataModelField = {
      name: "take",
      $container: findManySelectorInput,
      $type: "DataModelField",
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
      $container: findManySelectorInput,
      $type: "DataModelField",
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
      $container: findManySelectorInput,
      $type: "DataModelField",
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

    const edgeSchema = {
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

    const edgeNodeSchema: DataModelField = {
      $container: edgeSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "node",
      type: undefined
    };
    edgeNodeSchema.type = {
      $container: edgeNodeSchema,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: dataModel,
        $refText: dataModel.name
      }
    } as DataModelFieldType;
    edgeSchema.fields.push(edgeNodeSchema);

    const edgeCursorSchema: DataModelField = {
      $container: edgeSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "cursor",
      type: undefined
    };
    edgeCursorSchema.type = {
      $container: edgeCursorSchema,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      type: "String"
    } as DataModelFieldType;
    edgeSchema.fields.push(edgeCursorSchema);

    apiModels.push(edgeSchema);

    const connectionSchema = {
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

    const connectionEdgesSchema: DataModelField = {
      $container: connectionSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "edges",
      type: undefined
    };
    connectionEdgesSchema.type = {
      $container: connectionEdgesSchema,
      $type: "DataModelFieldType",
      array: true,
      optional: false,
      reference: {
        ref: edgeSchema,
        $refText: edgeSchema.name
      }
    } as DataModelFieldType;
    connectionSchema.fields.push(connectionEdgesSchema);

    const connectionPageInfoSchema: DataModelField = {
      $container: connectionSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "pageInfo",
      type: undefined
    };
    connectionPageInfoSchema.type = {
      $container: connectionPageInfoSchema,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: pageInfo,
        $refText: pageInfo.name
      }
    } as DataModelFieldType;
    connectionSchema.fields.push(connectionPageInfoSchema);

    const connectionTotalCountSchema: DataModelField = {
      $container: connectionSchema,
      $type: "DataModelField",
      attributes: [],
      comments: [],
      name: "totalCount",
      type: undefined
    };
    connectionTotalCountSchema.type = {
      $container: connectionTotalCountSchema,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      type: "Int"
    } as DataModelFieldType;
    connectionSchema.fields.push(connectionTotalCountSchema);

    apiModels.push(connectionSchema);

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
        ref: connectionSchema,
        $refText: connectionSchema.name
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
};

const addMutations = (
  model: Model,
  dataModels: DataModel[],
  operationGroups: OperationGroup[],
  inputs: Input[],
  apiModels: ApiModel[],
  interfaces: Interface[],
  enums: Enum[]
) => {
  const rootContainer =
    apiModels.length > 0 ? apiModels[0].$container : undefined;

  const mutationOperationGroup: OperationGroup = operationGroups.find(
    operationGroup => operationGroup.name === "Mutation"
  );

  dataModels.forEach(dataModel => {
    const createDataModelInput: Input = {
      $container: rootContainer,
      $type: "Input",
      attributes: [],
      comments: [],
      fields: [],
      name: `Create${dataModel.name}Input`,
      superTypes: [],
      $resolvedFields: []
    };

    dataModel.fields.forEach(field => {
      if (!ENTITY_CLASS_FIELDS.includes(field.name as EntityClassFields)) {
        const createDataModelInputDataField: DataModelField = {
          name: field.name,
          $container: createDataModelInput,
          $type: "DataModelField",
          attributes: [],
          comments: [],
          type: undefined
        };
        if (
          isDataModel(field.type.reference?.ref) ||
          isEnum(field.type.reference?.ref)
        ) {
          createDataModelInputDataField.type = {
            $container: createDataModelInputDataField,
            $type: "DataModelFieldType",
            array: field.type.array,
            optional: field.type.optional,
            reference: {
              ref: field.type.reference.ref,
              $refText: field.type.reference.ref.name
            }
          };
        } else {
          createDataModelInputDataField.type = {
            $container: createDataModelInputDataField,
            $type: "DataModelFieldType",
            array: field.type.array,
            optional: field.type.optional,
            type: field.type.type
          };
        }

        createDataModelInput.fields.push(createDataModelInputDataField);
      }
    });

    inputs.push(createDataModelInput);

    const createDataModelOperation: Operation = {
      $container: mutationOperationGroup,
      $type: "Operation",
      attributes: [],
      comments: [],
      params: [],
      name: `create${upperCaseFirst(dataModel.name)}`,
      resultType: undefined
    };
    createDataModelOperation.resultType = {
      $container: createDataModelOperation,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: dataModel,
        $refText: dataModel.name
      }
    } as DataModelFieldType;

    const createDataModelOperationDataParam: OperationInputParam = {
      $container: createDataModelOperation,
      $type: "OperationInputParam",
      default: false,
      name: "data",
      type: undefined
    };
    createDataModelOperationDataParam.type = {
      $container: createDataModelOperationDataParam,
      $type: "DataModelFieldType",
      array: false,
      optional: false,
      reference: {
        ref: createDataModelInput,
        $refText: `Create${dataModel.name}DataInput`
      }
    } as DataModelFieldType;

    createDataModelOperation.params.push(createDataModelOperationDataParam);
    mutationOperationGroup.fields.push(createDataModelOperation);
  });

  return {
    dataModels,
    operationGroups,
    inputs,
    apiModels,
    interfaces,
    enums
  };
};
