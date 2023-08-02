import { ZodError, ZodIssue, ZodIssueCode } from "zod";
import { IError } from "../types";

export type BaseErrorCode =
  | ZodIssue["code"]
  | "missing_issue_code"
  | "invalid_config";
export const BaseErrorCode = {
  ...ZodIssueCode,
  missing_issue_code: "missing_issue_code" as BaseErrorCode,
  invalid_config: "invalid_config" as BaseErrorCode,
};

/**
 *
 * @export
 * @class BaseError
 * @extends {Error}
 *
 * A base class for all error types
 */
export class BaseError extends ZodError implements IError {
  public name = "Error";
  public code: BaseErrorCode;

  constructor(
    code = BaseErrorCode.missing_issue_code,
    message: string,
    public extendedMessage?: string
  ) {
    super([{ message, code: code as any, path: [] }]);

    this.code = code;
    this.extendedMessage ??= message;
  }

  public isSameError = (other: unknown): boolean =>
    this.name === (other as BaseError)?.name;
}
