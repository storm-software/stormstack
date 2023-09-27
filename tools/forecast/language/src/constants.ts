/**
 * Supported Prisma db providers
 */
export const SUPPORTED_PROVIDERS = [
  "sqlite",
  "postgresql",
  "mysql",
  "sqlserver",
  "cockroachdb"
];

/**
 * Name of module contributed by plugins
 */
export const PLUGIN_MODULE_NAME = "plugin.forecast";

/**
 * All scalar types
 */
export const SCALAR_TYPES = [
  "String",
  "Int",
  "Float",
  "Decimal",
  "BigInt",
  "Boolean",
  "Bytes",
  "DateTime"
];

/**
 * Name of standard library module
 */
export const STD_LIB_MODULE_NAME = "stdlib.forecast";

/**
 * Validation issues
 */
export enum IssueCodes {
  MissingOppositeRelation = "miss-opposite-relation"
}

/**
 * Expression context
 */
export enum ExpressionContext {
  DefaultValue = "DefaultValue",
  AccessPolicy = "AccessPolicy",
  ValidationRule = "ValidationRule"
}
