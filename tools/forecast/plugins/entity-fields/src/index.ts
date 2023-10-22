import {
  Context,
  PluginExtend,
  getDataModels
} from "@stormstack/tools-forecast-codegen";
import {
  AttributeArg,
  AttributeParam,
  DataModelField,
  DataModelFieldAttribute,
  DataModelFieldType,
  ExpressionType,
  InternalAttribute,
  LiteralExpr,
  Model
} from "@stormstack/tools-forecast-language/ast";
import {
  ENTITY_CLASS_FIELDS,
  EntityFieldsPluginOptions,
  IdFieldFormat
} from "./types";

export const name = "Entity Fields Extension";

export const options = {
  idName: "id",
  idFormat: IdFieldFormat.UUID,
  createdAtName: "createdAt",
  createdByName: "createdBy",
  updatedAtName: "updatedAt",
  updatedByName: "updatedBy",
  sequenceName: "sequence"
};

export const extend: PluginExtend<EntityFieldsPluginOptions> = async (
  {
    idName,
    idFormat,
    createdAtName,
    createdByName,
    updatedAtName,
    updatedByName,
    sequenceName
  }: EntityFieldsPluginOptions,
  context: Context
): Promise<Model> => {
  const model = context.model;

  getDataModels(model).forEach(dataModel => {
    let idField: DataModelField = dataModel.fields.find(
      field => field.name?.toLowerCase() === idName.toLowerCase()
    );
    if (!idField) {
      idField = {
        name: idName,
        $container: dataModel,
        $type: "DataModelField",
        attributes: [],
        comments: [`The unique identifier for the ${dataModel.name}`],
        type: undefined
      };
      idField.type = {
        $container: idField,
        $type: "DataModelFieldType",
        array: false,
        optional: false,
        type: "String"
      } as DataModelFieldType;

      const idAttribute: DataModelFieldAttribute = {
        $container: idField,
        $containerIndex: 0,
        $containerProperty: "attributes",
        $type: "DataModelFieldAttribute",
        args: [],
        decl: undefined
      };

      idAttribute.decl = {
        ref: {
          $container: model,
          $containerProperty: "declarations",
          $type: "Attribute",
          name: "@id",
          attributes: [],
          params: []
        },
        $refText: "@id"
      };
      idAttribute.decl.ref.attributes.push({
        $container: idAttribute.decl.ref,
        $containerProperty: "attributes",
        $type: "InternalAttribute",
        args: [],
        decl: {
          ref: {
            $container: model,
            $containerProperty: "declarations",
            $type: "Attribute",
            name: "@@@prisma",
            attributes: [],
            params: []
          },
          $refText: "@@@prisma"
        }
      });

      idField.attributes.push(idAttribute);

      idField.type = {
        $container: idField,
        $type: "DataModelFieldType",
        array: false,
        optional: false,
        type: "String"
      } as DataModelFieldType;

      addDefaultValue(
        model,
        idField,
        idFormat ?? IdFieldFormat.UUID,
        "FunctionDecl"
      );
    }

    let createdAtField: DataModelField = dataModel.fields.find(
      field => field.name?.toLowerCase() === createdAtName.toLowerCase()
    );
    if (!createdAtField) {
      createdAtField = {
        name: createdAtName,
        $container: dataModel,
        $type: "DataModelField",
        attributes: [],
        comments: [`A timestamp of when the ${dataModel.name} was created`],
        type: undefined
      };
      createdAtField.type = {
        $container: createdAtField,
        $type: "DataModelFieldType",
        array: false,
        optional: false,
        type: "DateTime"
      } as DataModelFieldType;

      addDefaultValue(model, createdAtField, "now", "FunctionDecl");
    }

    let createdByField: DataModelField = dataModel.fields.find(
      field => field.name?.toLowerCase() === createdByName.toLowerCase()
    );
    if (!createdByField) {
      createdByField = {
        name: createdByName,
        $container: dataModel,
        $type: "DataModelField",
        attributes: [],
        comments: [`The user who created the ${dataModel.name}`],
        type: undefined
      };
      createdByField.type = {
        $container: createdByField,
        $type: "DataModelFieldType",
        array: false,
        optional: false,
        type: "String"
      } as DataModelFieldType;
    }

    let updatedAtField: DataModelField = dataModel.fields.find(
      field => field.name?.toLowerCase() === updatedAtName.toLowerCase()
    );
    if (!updatedAtField) {
      updatedAtField = {
        name: updatedAtName,
        $container: dataModel,
        $type: "DataModelField",
        attributes: [],
        comments: [
          `A timestamp of when the ${dataModel.name} was last updated`
        ],
        type: undefined
      };
      updatedAtField.type = {
        $container: updatedAtField,
        $type: "DataModelFieldType",
        array: false,
        optional: true,
        type: "DateTime"
      } as DataModelFieldType;
    }

    let updatedByField: DataModelField = dataModel.fields.find(
      field => field.name?.toLowerCase() === updatedByName.toLowerCase()
    );
    if (!updatedByField) {
      updatedByField = {
        name: updatedByName,
        $container: dataModel,
        $type: "DataModelField",
        attributes: [],
        comments: [`The user who last updated the ${dataModel.name}`],
        type: undefined
      };
      updatedByField.type = {
        $container: updatedByField,
        $type: "DataModelFieldType",
        array: false,
        optional: true,
        type: "String"
      } as DataModelFieldType;
    }

    let sequenceField: DataModelField = dataModel.fields.find(
      field => field.name?.toLowerCase() === sequenceName.toLowerCase()
    );
    if (!sequenceField) {
      sequenceField = {
        name: sequenceName,
        $container: dataModel,
        $type: "DataModelField",
        attributes: [],
        comments: [`The current sequence of the ${dataModel.name}`],
        type: undefined
      };
      sequenceField.type = {
        $container: sequenceField,
        $type: "DataModelFieldType",
        array: false,
        optional: false,
        type: "Int"
      } as DataModelFieldType;

      addDefaultValue(model, sequenceField, "0", "LiteralExpr");
    }

    dataModel.fields = [
      idField,
      sequenceField,
      createdAtField,
      createdByField,
      updatedAtField,
      updatedByField,
      ...dataModel.fields.filter(
        field =>
          !ENTITY_CLASS_FIELDS.some(entityField => entityField === field.name)
      )
    ];
  });

  return model;
};

const addDefaultValue = (
  model: Model,
  field: DataModelField,
  value: string,
  argType: "FunctionDecl" | "LiteralExpr"
): DataModelField => {
  const defaultAttribute: DataModelFieldAttribute = {
    $container: field,
    $containerIndex: 1,
    $containerProperty: "attributes",
    $type: "DataModelFieldAttribute",
    args: [],
    decl: {
      ref: {
        $container: model,
        $containerProperty: "declarations",
        $type: "Attribute",
        name: "@default",
        attributes: [],
        params: []
      },
      $refText: "@default"
    }
  };

  let type!: ExpressionType;
  switch (field.type.type) {
    case "String":
      type = "String";
      break;
    case "Boolean":
      type = "Boolean";
      break;
    case "DateTime":
      type = "DateTime";
      break;
    case "Float":
    case "Decimal":
      type = "Float";
      break;
    case "BigInt":
    case "Int":
      type = "Int";
      break;
    case "Json":
      type = "Object";
      break;
    default:
      type = "Any";
      break;
  }

  if (argType === "FunctionDecl") {
    const defaultAttributeArg: AttributeArg = {
      $container: defaultAttribute,
      $containerIndex: 0,
      $containerProperty: "args",
      $type: "AttributeArg",
      value: undefined
    };
    defaultAttributeArg.value = {
      $container: defaultAttributeArg,
      $containerProperty: "value",
      $type: "InvocationExpr",
      args: [],
      function: undefined
    };

    defaultAttributeArg.value.function = {
      ref: {
        $container: model,
        $containerProperty: "declarations",
        $type: "FunctionDecl",
        name: value,
        attributes: [],
        params: [],
        returnType: undefined
      },
      $refText: value
    };

    defaultAttributeArg.value.function.ref.returnType = {
      $container: defaultAttributeArg.value.function.ref,
      $containerProperty: "returnType",
      $type: "FunctionParamType",
      array: false,
      type
    };

    const defaultAttributeArgAttribute: InternalAttribute = {
      $container: defaultAttribute.decl.ref,
      $containerProperty: "attributes",
      $type: "InternalAttribute",
      args: [],
      decl: {
        ref: {
          $container: model,
          $containerProperty: "declarations",
          $type: "Attribute",
          name: "@@@expressionContext",
          attributes: [],
          params: [
            {
              $container: undefined,
              $containerProperty: undefined,
              $type: "AttributeParam",
              name: "context",
              type: {
                $container: undefined,
                $containerProperty: undefined,
                $type: "AttributeParamType",
                array: false,
                optional: false,
                type: "String"
              },
              default: true
            }
          ]
        },
        $refText: "@@@expressionContext"
      }
    };

    defaultAttributeArg.value.function.ref.attributes.push(
      defaultAttributeArgAttribute
    );

    defaultAttribute.args.push(defaultAttributeArg);
  } else if (argType === "LiteralExpr") {
    const defaultAttributeArg: AttributeArg = {
      $container: defaultAttribute,
      $containerIndex: 0,
      $containerProperty: "args",
      $type: "AttributeArg",
      value: undefined
    };
    const defaultAttributeArgValue: LiteralExpr = {
      $container: defaultAttributeArg,
      $containerProperty: "declarations",
      $type: "LiteralExpr",
      value
    };

    defaultAttributeArg.value = defaultAttributeArgValue;
    defaultAttribute.args.push(defaultAttributeArg);
  }

  const defaultAttributeParam: AttributeParam = {
    $container: defaultAttribute.decl.ref,
    $containerProperty: "params",
    $type: "AttributeParam",
    name: "value",
    type: undefined,
    default: true
  };
  defaultAttributeParam.type = {
    $container: defaultAttributeParam,
    $containerProperty: "type",
    $type: "AttributeParamType",
    array: false,
    optional: false,
    type: "ContextType"
  };

  defaultAttribute.decl.ref.params.push(defaultAttributeParam);

  defaultAttribute.decl.ref.attributes.push({
    $container: defaultAttribute.decl.ref,
    $containerProperty: "attributes",
    $type: "InternalAttribute",
    args: [],
    decl: {
      ref: {
        $container: model,
        $containerProperty: "declarations",
        $type: "Attribute",
        name: "@@@prisma",
        attributes: [],
        params: []
      },
      $refText: "@@@prisma"
    }
  });

  field.attributes.push(defaultAttribute);

  return field;
};
