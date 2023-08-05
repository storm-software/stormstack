import { ZodIssue, ZodIssueCode } from "zod";

export type BaseErrorCode =
  | ZodIssue["code"]
  | "missing_issue_code"
  | "invalid_config"
  | "failed_to_load_file";
export const BaseErrorCode = {
  ...ZodIssueCode,
  missing_issue_code: "missing_issue_code" as BaseErrorCode,
  invalid_config: "invalid_config" as BaseErrorCode,
  failed_to_load_file: "failed_to_load_file" as BaseErrorCode,
  missing_context: "missing_context" as BaseErrorCode,
  record_not_found: "record_not_found" as BaseErrorCode,
  required_field_missing: "required_field_missing" as BaseErrorCode,
};
