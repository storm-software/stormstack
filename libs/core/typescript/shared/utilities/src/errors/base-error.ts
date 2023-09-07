/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from "zod";
import { IError } from "../types";
import { BaseErrorCode } from "./error-codes";

/**
 *
 * @export
 * @class BaseError
 * @extends {Error}
 *
 * A base class for all error types
 */
export class BaseError extends ZodError implements IError {
  public override name = "Error";
  public code: BaseErrorCode;

  constructor(
    code = BaseErrorCode.missing_issue_code,
    message: string,
    public extendedMessage?: string,
    issues: BaseError[] = []
  ) {
    super([
      { message, code: code as any, path: [] },
      ...issues.map(issue => ({
        message: issue.message,
        code: issue.code as any,
        path: []
      }))
    ]);

    this.code = code;
    this.extendedMessage ??= message;
  }

  public isSameError = (other: unknown): boolean =>
    this.name === (other as BaseError)?.name;

  public override addIssue = (
    issue: Pick<BaseError, "message"> &
      Partial<Pick<BaseError, "code">> & { path?: Array<string | number> }
  ) => {
    this.issues.push({
      message: issue.message,
      code: issue.code as any,
      path: issue.path ?? []
    });
  };

  public override addIssues = (
    issues: Array<
      Pick<BaseError, "message"> &
        Partial<Pick<BaseError, "code">> & { path?: Array<string | number> }
    > = []
  ) => {
    issues.forEach(issue => this.addIssue(issue));
  };
}
