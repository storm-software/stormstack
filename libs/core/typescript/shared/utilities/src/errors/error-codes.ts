import { ZodIssue, ZodIssueCode } from "zod";

export type BaseErrorCode =
  | ZodIssue["code"]
  | "missing_issue_code"
  | "invalid_config"
  | "failed_to_load_file"
  | "missing_context"
  | "record_not_found"
  | "required_field_missing"
  | "database_query_error"
  | "model_validation_error"
  | "field_validation_error"
  | "invalid_parameter"
  | "invalid_request"
  | "type_error";
export const BaseErrorCode = {
  ...ZodIssueCode,
  missing_issue_code: "missing_issue_code" as BaseErrorCode,
  invalid_config: "invalid_config" as BaseErrorCode,
  failed_to_load_file: "failed_to_load_file" as BaseErrorCode,
  missing_context: "missing_context" as BaseErrorCode,
  record_not_found: "record_not_found" as BaseErrorCode,
  required_field_missing: "required_field_missing" as BaseErrorCode,
  database_query_error: "database_query_error" as BaseErrorCode,
  model_validation_error: "model_validation_error" as BaseErrorCode,
  field_validation_error: "field_validation_error" as BaseErrorCode,
  invalid_parameter: "invalid_parameter" as BaseErrorCode,
  invalid_request: "invalid_request" as BaseErrorCode,
  type_error: "type_error" as BaseErrorCode
};
