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
export function isDataModelHelper(astNode: AstNode = this) {
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
export function isApiModelHelper(astNode: AstNode = this) {
  return isApiModel(astNode);
}

/**
 * Check if a top-level node object represents a `Interface`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `Interface`
 */
export function isInterfaceHelper(astNode: AstNode = this) {
  return isInterface(astNode);
}

/**
 * Check if a top-level node object represents a `Input`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `Input`
 */
export function isInputHelper(astNode: AstNode = this) {
  return isInput(astNode);
}

/**
 * Check if a top-level node object represents a `OperationGroup`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `OperationGroup`
 */
export function isOperationGroupHelper(astNode: AstNode = this) {
  return isOperationGroup(astNode);
}

/**
 * Check if a top-level node object represents a `Enum`
 *
 * @param astNode The top-level node object to check
 * @returns Indicator specifying if the top-level node object represents a `Enum`
 */
export function isEnumHelper(astNode: AstNode = this) {
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
export function isArrayFieldHelper(field: DataModelFieldType = this) {
  return field?.array;
}

/**
 * Check if a field is marked as optional in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field is marked as optional
 */
export function isOptionalFieldHelper(field: DataModelFieldType = this) {
  return field?.optional;
}

/**
 * Check if a field is marked as unsupported in the schema
 *
 * @param field The field to check
 * @returns Indicator specifying if the field is marked as unsupported
 */
export function isUnsupportedFieldHelper(field: DataModelFieldType = this) {
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
export function isModelFieldHelper(field: DataModelFieldType = this) {
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

/**
 * Check if a field is an internal field (ex: `AND`, `OR`, `NOT`)
 *
 * @param field The field to check
 * @returns Indicator specifying if the field is an internal field
 */
export function isInternalFieldHelper(field: DataModelField = this) {
  return field?.name && ["AND", "OR", "NOT"].includes(field.name.toUpperCase());
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
  return (
    attribute?.ref?.name?.toLowerCase()?.replaceAll("@", "") === "default" &&
    isArrayLengthHelper(this?.args, 1)
  );
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
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "relation".toLowerCase()
  );
}

/**
 * Check if an attribute is the `email` attribute
 *
 * @remarks The `email` attribute is used to specify that a field's format should be a valid email address
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@email` attribute
 */
export function isEmailAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "email".toLowerCase()
  );
}

/**
 * Check if an attribute is the `ip` attribute
 *
 * @remarks The `ip` attribute is used to specify that a field's format should be a valid IP address
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@ip` attribute
 */
export function isIpAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "ip".toLowerCase()
  );
}

/**
 * Check if an attribute is the `mac` attribute
 *
 * @remarks The `mac` attribute is used to specify that a field's format should be a valid MAC address
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@mac` attribute
 */
export function isMacAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "mac".toLowerCase()
  );
}

/**
 * Check if an attribute is the `phoneNumber` attribute
 *
 * @remarks The `phoneNumber` attribute is used to specify that a field's format should be a valid Phone Number
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@phoneNumber` attribute
 */
export function isPhoneNumberAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "phoneNumber".toLowerCase()
  );
}

/**
 * Check if an attribute is the `semver` attribute
 *
 * @remarks The `semver` attribute is used to specify that a field's format should be a valid Semantic Version
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@semver` attribute
 */
export function isSemverAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "semver".toLowerCase()
  );
}

/**
 * Check if an attribute is the `postalCode` attribute
 *
 * @remarks The `postalCode` attribute is used to specify that a field's format should be a valid Postal Code
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@postalCode` attribute
 */
export function isPostalCodeAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "postalCode".toLowerCase()
  );
}

/**
 * Check if an attribute is the `latitude` attribute
 *
 * @remarks The `latitude` attribute is used to specify that a field's format should be a valid Latitude
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@latitude` attribute
 */
export function isLatitudeAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "latitude".toLowerCase()
  );
}

/**
 * Check if an attribute is the `longitude` attribute
 *
 * @remarks The `longitude` attribute is used to specify that a field's format should be a valid Longitude
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@longitude` attribute
 */
export function isLongitudeAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "longitude".toLowerCase()
  );
}

/**
 * Check if an attribute is the `countryCode` attribute
 *
 * @remarks The `countryCode` attribute is used to specify that a field's format should be a valid Country Code
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@countryCode` attribute
 */
export function isCountryCodeAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "countryCode".toLowerCase()
  );
}

/**
 * Check if an attribute is the `timeZone` attribute
 *
 * @remarks The `timeZone` attribute is used to specify that a field's format should be a valid Time Zone
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@timeZone` attribute
 */
export function isTimeZoneAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "timeZone".toLowerCase()
  );
}

/**
 * Check if an attribute is the `datetime` attribute
 *
 * @remarks The `datetime` attribute is used to specify that a field's format should be a valid DateTime
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@datetime` attribute
 */
export function isDatetimeAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "datetime".toLowerCase()
  );
}

/**
 * Check if an attribute is the `has` attribute
 *
 * @remarks The `has` attribute is used to specify that a field should have a certain value in it (uses `includes` function)
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@has` attribute
 */
export function isHasAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "has".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `hasEvery` attribute
 *
 * @remarks The `hasEvery` attribute is used to specify that every item of a field should have a certain value in it (uses the `every` and `includes` functions)
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@hasEvery` attribute
 */
export function isHasEveryAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "hasEvery".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `hasSome` attribute
 *
 * @remarks The `hasSome` attribute is used to specify that some item of a field should have a certain value in it (uses the `some` and `includes` functions)
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@hasSome` attribute
 */
export function isHasSomeAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "hasSome".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `isEmpty` attribute
 *
 * @remarks The `isEmpty` attribute is used to specify that a field's value is empty
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@isEmpty` attribute
 */
export function isIsEmptyAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "isEmpty".toLowerCase()
  );
}

/**
 * Check if an attribute is the `regex` attribute
 *
 * @remarks The `regex` attribute is used to specify that a field's value should match the specified value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@regex` attribute
 */
export function isRegexAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "regex".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `length` attribute
 *
 * @remarks The `length` attribute is used to specify that a field's length should be between two specified values provided in parameters (ex: `@length(1, 10)`)
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@length` attribute
 */
export function isLengthAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "length".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `gte` attribute
 *
 * @remarks The `gte` attribute is used to specify that a field's value is greater than or equal to a provided value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@gte` attribute
 */
export function isGteAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "gte".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `gt` attribute
 *
 * @remarks The `gt` attribute is used to specify that a field's value is greater than a provided value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@gt` attribute
 */
export function isGtAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "gt".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `lte` attribute
 *
 * @remarks The `lte` attribute is used to specify that a field's value is less than or equal to a provided value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@lte` attribute
 */
export function isLteAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "lte".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `lt` attribute
 *
 * @remarks The `lt` attribute is used to specify that a field's value is less than a provided value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@lt` attribute
 */
export function isLtAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "lt".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `multipleOf` attribute
 *
 * @remarks The `multipleOf` attribute is used to specify that a field's value is a multiple of the provided value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@multipleOf` attribute
 */
export function isMultipleOfAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "multipleOf".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `contains` attribute
 *
 * @remarks The `contains` attribute is used to specify that a field's format should contains the specified value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@contains` attribute
 */
export function isContainsAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "contains".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `startsWith` attribute
 *
 * @remarks The `startsWith` attribute is used to specify that a field's format should start with the specified value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@startsWith` attribute
 */
export function isStartsWithAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "startsWith".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `endsWith` attribute
 *
 * @remarks The `endsWith` attribute is used to specify that a field's format should end with the specified value
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@endsWith` attribute
 */
export function isEndsWithAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
      "endsWith".toLowerCase() && isArrayLengthHelper(this?.args, 1)
  );
}

/**
 * Check if an attribute is the `url` attribute
 *
 * @remarks The `url` attribute is used to specify that a field's format should be a valid URL address
 *
 * @param attribute The attribute to check
 * @returns Indicator specifying if the attribute is the `@url` attribute
 */
export function isUrlAttributeHelper(attribute: Reference<Attribute>) {
  return (
    attribute?.ref?.name?.toLowerCase().replaceAll("@", "") ===
    "url".toLowerCase()
  );
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
 * Check if a value is equal to another value
 *
 * @param item1 The first item to compare
 * @param item2 The second item to compare
 * @returns Indicator specifying if the two items are equal
 */
export function isEqualHelper(item1: any, item2: any) {
  return item1 === item2;
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
