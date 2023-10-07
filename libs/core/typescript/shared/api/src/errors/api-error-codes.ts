import { BaseError, BaseErrorCode } from "@stormstack/core-shared-utilities";

export type ApiErrorCode =
  | BaseError["code"]
  | "review_user_input"
  | "csrf_token_missing"
  | "connection_failure"
  | "authorization_error"
  | "subscription_error";
export const ApiErrorCode = {
  ...BaseErrorCode,
  review_user_input: "review_user_input" as ApiErrorCode,
  csrf_token_missing: "csrf_token_missing" as ApiErrorCode,
  connection_failure: "connection_failure" as ApiErrorCode,
  authorization_error: "authorization_error" as ApiErrorCode,
  subscription_error: "subscription_error" as ApiErrorCode
};
