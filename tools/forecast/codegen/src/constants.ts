// replaced at build time
export const TELEMETRY_TRACKING_TOKEN = "<TELEMETRY_TRACKING_TOKEN>";

/**
 * Expression context
 */
export enum ExpressionContext {
  DefaultValue = "DefaultValue",
  AccessPolicy = "AccessPolicy",
  ValidationRule = "ValidationRule"
}

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
 * Validation issues
 */
export enum IssueCodes {
  MissingOppositeRelation = "miss-opposite-relation"
}
