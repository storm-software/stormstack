import {
  camelCase,
  constantCase,
  isSet,
  isString,
  pascalCase,
  snakeCase
} from "@stormstack/core-shared-utilities";
import {
  ArrayExpr,
  AstNode,
  Attribute,
  AttributeArg,
  DataModel,
  DataModelAttribute,
  DataModelField,
  DataModelFieldAttribute,
  DataModelFieldType,
  Enum,
  Expression,
  FunctionDecl,
  InvocationExpr,
  LiteralExpr,
  Reference,
  ReferenceExpr,
  isApiModel,
  isDataModel,
  isDataModelAttribute,
  isEnum,
  isInput,
  isInterface,
  isOperationGroup
} from "@stormstack/tools-forecast-language/ast";
import { HelperOptions } from "handlebars";
import { utils } from "handlebars-utils";
import { Context } from "../types";
import { getDataModels } from "./utils";

/**************************
 * Model Node helpers
 *************************/

/**
 * Check if a top-level node object represents a `DataModel`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `DataModel`
 */
export function isDataModelHelper(astNode: AstNode) {
  return isDataModel(astNode);
}

/**
 * Check if a top-level node object represents a `DataModel`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `DataModel`
 */
export function eachDataModelHelper(context: Context, options: HelperOptions) {
  return getDataModels(context.model)
    .map((model: DataModel) => options.fn(model))
    .join("");
}

/**
 * Check if a top-level node object represents a `ApiModel`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `ApiModel`
 */
export function isApiModelHelper(astNode: AstNode) {
  return isApiModel(astNode);
}

/**
 * Check if a top-level node object represents a `Interface`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `Interface`
 */
export function isInterfaceHelper(astNode: AstNode) {
  return isInterface(astNode);
}

/**
 * Check if a top-level node object represents a `Input`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `Input`
 */
export function isInputHelper(astNode: AstNode) {
  return isInput(astNode);
}

/**
 * Check if a top-level node object represents a `OperationGroup`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `OperationGroup`
 */
export function isOperationGroupHelper(astNode: AstNode) {
  return isOperationGroup(astNode);
}

/**
 * Check if a top-level node object represents a `Enum`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `Enum`
 */
export function isEnumHelper(astNode: AstNode) {
  return isEnum(astNode);
}

/**
 * Check if a type string represents an object model in the schema
 *
 * @remarks In Forecast we consider a node to be a model if it's type is a `DataModel`, `ApiModel`, `Input`, `Interface`, or `OperationGroup`
 *
 * @param type A string with the name of the type to check
 * @returns Indicator specifying if the type is a model
 */
export function isModelHelper(type: string) {
  return (
    isString(type) &&
    type &&
    [
      "DataModel".toLowerCase(),
      "ApiModel".toLowerCase(),
      "Input".toLowerCase(),
      "Interface".toLowerCase(),
      "OperationGroup".toLowerCase()
    ].includes(type?.toLowerCase())
  );
}

/**************************
 * Expression helpers
 *************************/

/**
 * Check if an expression is an invocation of a function
 *
 * @param expression The expression to check
 * @returns Indicator specifying if the expression is an invocation of a function
 */
export function isInvocationHelper(
  expression: Expression
): expression is InvocationExpr {
  return (
    isSet(expression?.$type) &&
    expression.$type?.toLowerCase() === "InvocationExpr".toLowerCase()
  );
}

/**
 * Check if an expression is a reference to another expression
 *
 * @param expression The expression to check
 * @returns Indicator specifying if the expression is a reference to another expression
 */
export function isReferenceExprHelper(
  expression: Expression
): expression is ReferenceExpr {
  return (
    isSet(expression?.$type) &&
    expression.$type?.toLowerCase() === "ReferenceExpr".toLowerCase()
  );
}

/**
 * Check if an expression is a literal
 *
 * @param expression The expression to check
 * @returns Indicator specifying if the expression is a literal
 */
export function isEnumReferenceHelper(expression: ReferenceExpr): boolean {
  return (
    isReferenceExprHelper(expression) &&
    (expression.$resolvedType.decl as Enum)?.$type?.toLowerCase() ===
      "Enum".toLowerCase()
  );
}

/**
 * Check if an expression is a literal
 *
 * @param expression The expression to check
 * @returns Indicator specifying if the expression is a literal
 */
export function isLiteralHelper(
  expression: Expression
): expression is LiteralExpr {
  return (
    isSet(expression?.$type) &&
    expression.$type?.toLowerCase() === "LiteralExpr".toLowerCase() &&
    isSet((expression as LiteralExpr)?.value)
  );
}

/**
 * Check if an expression is a array type expression
 *
 * @param expression The expression to check
 * @returns Indicator specifying if the expression is a array type expression
 */
export function isArrayExprHelper(
  expression: Expression
): expression is ArrayExpr {
  return (
    isSet(expression?.$type) &&
    expression.$type?.toLowerCase() === "ArrayExpr".toLowerCase() &&
    isSet((expression as ArrayExpr)?.items)
  );
}

/**************************
 * Function Declaration helpers
 *************************/

/**
 * Check if the parameter is a function declaration
 *
 * @param functionDecl The parameter to check
 * @returns Indicator specifying if the parameter value was a function declaration
 */
export function isFunctionDeclHelper(
  functionDecl: any
): functionDecl is FunctionDecl {
  return (
    (functionDecl as FunctionDecl)?.name &&
    (functionDecl as FunctionDecl).name.length > 0
  );
}

/**************************
 * Model Field helpers
 *************************/

/**
 * Check if a field is an array of multiple values
 *
 * @param field The field to check
 * @returns Indicator specifying if the field is an array
 */
export function isArrayFieldHelper(field: DataModelFieldType) {
  return field?.array;
}

/**
 * Check if a field is marked as optional in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field is marked as optional
 */
export function isOptionalFieldHelper(field: DataModelFieldType) {
  return field?.optional;
}

/**
 * Check if a field is marked as unsupported in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field is marked as unsupported
 */
export function isUnsupportedFieldHelper(field: DataModelFieldType) {
  return field?.unsupported;
}

/**
 * Check if a field's type is a object model in the schema
 *
 * @example A field on the `User` DataModel type is named `account`. The `account` field has the type `UserAccount`, which is also a DataModel.
 * @remarks In Forecast we consider a node to be a model if its type is a DataModel, ApiModel, Input, Interface, or OperationGroup
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is a model
 */
export function isModelFieldHelper(field: DataModelFieldType) {
  return isModelHelper(field?.reference?.ref.$type);
}

/**
 * Check if a field is a Foreign Key for another model in the schema
 *
 * @example A field on the `User` DataModel type is named `accountId` which has the same value as a field named `id` on the `UserAccount` DataModel.
 *
 * @param field The field to check
 * @returns Indicator specifying if the field is a Foreign Key for another model in the schema
 */
export function isForeignKeyFieldHelper(
  field: DataModelField,
  astNode: AstNode
) {
  if (isModelHelper(astNode.$type)) {
    return ((astNode as DataModel)?.fields ?? []).some(
      (modelField: DataModelField) =>
        modelField.attributes.some((attribute: DataModelFieldAttribute) => {
          let foreignKey = attribute.args.find(
            (arg: AttributeArg) => arg.name === "fields"
          );
          if (!foreignKey || (attribute.args.length > 0 && attribute.args[0])) {
            foreignKey = attribute.args[0];
          }

          if (isArrayExprHelper(foreignKey?.value)) {
            return foreignKey.value.items.some(
              (item: Expression) =>
                isReferenceExprHelper(item) &&
                item.target.ref.name === field.name
            );
          } else if (isReferenceExprHelper(foreignKey?.value)) {
            return foreignKey.value.target.ref.name === field.name;
          }

          return false;
        })
    );
  }

  return false;
}

/**
 * Check if a field's type is `Int` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `Int`
 */
export function isIntegerFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "int";
}

/**
 * Check if a field's type is `Float` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `Float`
 */
export function isFloatFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "float";
}

/**
 * Check if a field's type is `Decimal` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `Decimal`
 */
export function isDecimalFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "decimal";
}

/**
 * Check if a field's type is `BigInt` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `BigInt`
 */
export function isBigIntFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "bigint";
}

/**
 * Check if a field's type is `String` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `String`
 */
export function isStringFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "string";
}

/**
 * Check if a field's type is `Boolean` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `Boolean`
 */
export function isBooleanFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "boolean";
}

/**
 * Check if a field's type is `DateTime` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `DateTime`
 */
export function isDateTimeFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "datetime";
}

/**
 * Check if a field's type is `Bytes` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `Bytes`
 */
export function isBytesFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "bytes";
}

/**
 * Check if a field's type is `Json` in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field's type is `Json`
 */
export function isJsonFieldHelper(field: DataModelFieldType) {
  return field?.type?.toLowerCase() === "json";
}

export type ForeignKeyReferenceColumn = { model: string; name: string };
export type ForeignKeyReference = {
  name: string;
  tableColumns: ForeignKeyReferenceColumn[];
  foreignColumns: ForeignKeyReferenceColumn[];
};

/**
 * Check if a field is a Foreign Key for another model in the schema
 *
 * @example A field on the `User` DataModel type is named `accountId` which has the same value as a field named `id` on the `UserAccount` DataModel.
 *
 * @param field The field to check
 * @returns Indicator specifying if the field is a Foreign Key for another model in the schema
 */
export function withForeignKeyHelper(
  astNode: AstNode,
  context: Context,
  options: HelperOptions
) {
  const foreignKeyFields = ((astNode as DataModel)?.fields ?? []).filter(
    (field: DataModelField) => isForeignKeyFieldHelper(field, astNode)
  );

  return options.fn({
    references: foreignKeyFields.reduce(
      (result: ForeignKeyReference[], foreignKeyField: DataModelField) => {
        return ((astNode as DataModel)?.fields ?? []).reduce(
          (ret: ForeignKeyReference[], field: DataModelField) => {
            return field.attributes
              .filter(attribute => isRelationAttributeHelper(attribute.decl))
              .reduce(
                (
                  fkRefs: ForeignKeyReference[],
                  attribute: DataModelFieldAttribute
                ) => {
                  let fields = attribute.args.find(
                    (arg: AttributeArg) => arg.name === "fields"
                  );
                  if (
                    !fields &&
                    attribute.args.length > 0 &&
                    attribute.args[0]
                  ) {
                    fields = attribute.args[0];
                  }

                  let references = attribute.args.find(
                    (arg: AttributeArg) => arg.name === "references"
                  );
                  if (
                    !references &&
                    attribute.args.length > 1 &&
                    attribute.args[1]
                  ) {
                    references = attribute.args[1];
                  }

                  let foreignColumn!: string;
                  if (
                    isArrayExprHelper(fields?.value) &&
                    isArrayExprHelper(references?.value)
                  ) {
                    const index = fields.value?.items.findIndex(
                      (item: Expression) =>
                        isReferenceExprHelper(item) &&
                        item.target.ref.name === foreignKeyField.name
                    );
                    if (
                      isSet(index) &&
                      index >= 0 &&
                      index < references?.value?.items.length &&
                      isReferenceExprHelper(references.value.items[index])
                    ) {
                      foreignColumn = (
                        references.value?.items[index] as ReferenceExpr
                      )?.target?.ref?.name;
                    }
                  } else if (
                    isReferenceExprHelper(fields?.value) &&
                    isReferenceExprHelper(references?.value) &&
                    fields.value?.target.ref.name === field.name
                  ) {
                    foreignColumn = references.value?.target.ref.name;
                  }

                  if (foreignColumn) {
                    const foreignModel =
                      getDataModels(context.model).find(
                        (dataModel: DataModel) =>
                          dataModel.name === field.type.reference.ref.name
                      ).name ?? field.name;

                    let fkRef = ret.find(
                      (item: ForeignKeyReference) => item.name === field.name
                    );
                    if (!fkRef) {
                      fkRef = {
                        name: field.name,
                        tableColumns: [],
                        foreignColumns: []
                      };
                      fkRefs.push(fkRef);
                    }

                    fkRef.tableColumns.push({
                      model: (astNode as DataModel)?.name,
                      name: foreignKeyField.name
                    });
                    fkRef.foreignColumns.push({
                      model: foreignModel,
                      name: foreignColumn
                    });
                  }

                  return fkRefs;
                },
                ret
              );
          },
          result
        );
      },
      []
    )
  });
}

/**************************
 * Attribute helpers
 *************************/

/**
 * Check if an attribute is the `@default` attribute
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@default` attribute
 */
export function isDefaultAttributeHelper(attribute: Reference<Attribute>) {
  return attribute?.ref?.name?.toLowerCase()?.replaceAll("@", "") === "default";
}

/**
 * Check if an attribute is the `@unique` attribute
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@unique` attribute
 */
export function isUniqueAttributeHelper(attribute: Reference<Attribute>) {
  return attribute?.ref?.name?.toLowerCase().replaceAll("@", "") === "unique";
}

/**
 * Check if an attribute is the `@id` attribute
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@id` attribute
 */
export function isIdAttributeHelper(attribute: Reference<Attribute>) {
  return attribute?.ref?.name?.toLowerCase().replaceAll("@", "") === "id";
}

/**
 * Check if an attribute is the `@relation` attribute
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@relation` attribute
 */
export function isRelationAttributeHelper(attribute: Reference<Attribute>) {
  return attribute?.ref?.name?.toLowerCase().replaceAll("@", "") === "relation";
}

/**
 * Get the default value `Expression` of a field from the `@default` attribute in the schema.
 *
 * @param attribute The field's `@default` attribute object
 * @returns If the default value is a function, return the function reference. Otherwise, return the literal value.
 */
export function isDataModelAttributeHelper(
  attribute: any
): attribute is DataModelAttribute {
  return isDataModelAttribute(attribute);
}

/**
 * Check if a function declaration reference is an invocation of the `now` function
 *
 * @remarks The `now` function is used by the `@default` attribute to set the default value of a field to the current date and time
 *
 * @param functionDecl The function declaration reference to check
 * @returns Indicator specifying if the function declaration reference is an invocation of the `now()` function
 */
export function isNowHelper(functionDecl: FunctionDecl) {
  return (
    isString(functionDecl.name) &&
    functionDecl.name &&
    functionDecl.name.toLowerCase().startsWith("now")
  );
}

/**
 * Check if a function declaration reference is an invocation of the `cuid` function
 *
 * @remarks The `cuid` function is used by the `@default` attribute to set the default value of a field to a unique identifier generated using the CUID algorithm
 *
 * @param functionDecl The function declaration reference to check
 * @returns Indicator specifying if the function declaration reference is an invocation of the `cuid()` function
 */
export function isCuidHelper(functionDecl: FunctionDecl) {
  return (
    isString(functionDecl.name) &&
    functionDecl.name &&
    functionDecl.name.toLowerCase().startsWith("cuid")
  );
}

/**
 * Check if a function declaration reference is an invocation of the `uuid` function
 *
 * @remarks The `uuid` function is used by the `@default` attribute to set the default value of a field to a unique identifier generated using the RFC4122 UUID algorithm
 *
 * @param functionDecl The function declaration reference to check
 * @returns Indicator specifying if the function declaration reference is an invocation of the `uuid()` function
 */
export function isUuidHelper(functionDecl: FunctionDecl) {
  return (
    isString(functionDecl.name) &&
    functionDecl.name &&
    functionDecl.name.toLowerCase().startsWith("uuid")
  );
}

/**
 * Check if a function declaration reference is an invocation of the `snowflake` function
 *
 * @remarks The `snowflake` function is used by the `@default` attribute to set the default value of a field to a unique identifier generated using Twitter's Snowflake algorithm
 * @remarks Additional details about the Snowflake spec. can be found in [the Twitter announcing blog post](https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake.html) and [an article written by Akash Rajpurohit](https://akashrajpurohit.com/blog/snowflake-id-generating-unique-ids-for-distributed-systems/)
 *
 * @param functionDecl The function declaration reference to check
 * @returns Indicator specifying if the function declaration reference is an invocation of the `snowflake()` function
 */
export function isSnowflakeHelper(functionDecl: FunctionDecl) {
  return (
    isString(functionDecl.name) &&
    functionDecl.name &&
    functionDecl.name.toLowerCase().startsWith("snowflake")
  );
}

/**************************
 * General helpers
 *************************/

/**
 * Capitalize the first character of a string
 *
 * @example this Is An Example
 *
 * @param str The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeHelper(str: any) {
  if (!isString(str)) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to camel-case
 *
 * @example thisIsAnExample
 *
 * @param str The string to convert to camel-case
 * @returns The camel-case string
 */
export function camelCaseHelper(str: any) {
  if (!isString(str)) {
    return "";
  }

  return camelCase(str);
}

/**
 * Convert a string to pascal-case
 *
 * @example ThisIsAnExample
 *
 * @param str The string to convert to pascal-case
 * @returns The pascal-case string
 */
export function pascalCaseHelper(str: any) {
  if (!isString(str)) {
    return "";
  }

  return pascalCase(str);
}

/**
 * Convert a string to constant-case
 *
 * @example THIS_IS_AN_EXAMPLE
 *
 * @param str The string to convert to constant-case
 * @returns The constant-case string
 */
export function constantCaseHelper(str: any) {
  if (!isString(str)) {
    return "";
  }

  return constantCase(str);
}

/**
 * Convert a string to snake-case
 *
 * @example this_is_an_example
 *
 * @param str The string to convert to snake-case
 * @returns The snake-case string
 */
export function snakeCaseHelper(str: any) {
  if (!isString(str)) {
    return "";
  }

  return snakeCase(str);
}

/**
 * Check if a value is an array
 *
 * @param array The value to check if it is an array
 * @returns Indicator specifying if the value is an array
 */
export function isArrayHelper(array: any) {
  return Array.isArray(array);
}

/**
 * Check if a value is an array and if it has a minimum length specified through the `length` and `exact` parameters
 *
 * @param array The value to check if it is an array
 * @param length The minimum length of the array
 * @param isExact Indicator specifying if the length of the array should be exactly the same as the `length` parameter
 * @returns Indicator specifying if the value is an array and if it has a minimum length specified through the `length` and `exact` parameters
 */
export function isArrayLengthHelper(
  array: any,
  length: number = 1,
  isExact = false
) {
  return (
    isArrayHelper(array) &&
    ((!isExact && array.length >= length) ||
      (isExact && array.length === length))
  );
}

/**
 * Run the helper for each item in the array
 *
 * @param array The array to run the iterator function on
 * @param options The options passed to the helper
 * @returns The result of running the iterator function on each item in the array
 */
export function forEachHelper(array: any[], options: HelperOptions) {
  const args = isArrayLengthHelper(array, 1) ? array : [];

  const data = utils.createFrame(options, options.hash);

  let buffer = "";
  let i = -1;
  while (++i < args.length) {
    let item = array[i];
    data.index = i;
    item.index = i + 1;
    item.total = args.length;
    item.isFirst = i === 0;
    item.isLast = i === args.length - 1;
    buffer += options.fn(item, { data: data });
  }

  return buffer;
}
