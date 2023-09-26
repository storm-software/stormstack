/**
 * @stormstack/tools-storm-runtime package name
 */
export const RUNTIME_PACKAGE = "@stormstack/tools-storm-runtime";

export {
  AUXILIARY_FIELDS,
  CrudFailureReason,
  GUARD_FIELD_NAME,
  TRANSACTION_FIELD_NAME
} from "@stormstack/tools-storm-runtime";

/**
 * Expression context
 */
export enum ExpressionContext {
  DefaultValue = "DefaultValue",
  AccessPolicy = "AccessPolicy",
  ValidationRule = "ValidationRule"
}
