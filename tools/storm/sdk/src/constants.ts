/**
 * @open-system/tools-storm-runtime package name
 */
export const RUNTIME_PACKAGE = "@open-system/tools-storm-runtime";

export {
  AUXILIARY_FIELDS,
  CrudFailureReason,
  GUARD_FIELD_NAME,
  TRANSACTION_FIELD_NAME,
} from "@open-system/tools-storm-runtime";

/**
 * Expression context
 */
export enum ExpressionContext {
  DefaultValue = "DefaultValue",
  AccessPolicy = "AccessPolicy",
  ValidationRule = "ValidationRule",
}
