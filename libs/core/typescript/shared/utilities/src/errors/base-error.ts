/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Stacktracey requires buffer, which Vite does not polyfill by default
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  window.Buffer = window.Buffer || globalThis?.Buffer; // || require("node:buffer").Buffer;
}

import StackTracey from "stacktracey";

import { ZodError, ZodIssue } from "zod";
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
  public static parse(strBaseError: string): BaseError {
    const { code, message, extendedMessage, issues } = JSON.parse(
      strBaseError,
      (key: string, value: any) => {
        if (key === "code") {
          return BaseErrorCode[value as keyof typeof BaseErrorCode];
        } /*else if (key === "issues") {
          return String(value);
        }*/

        return value;
      }
    );

    const result = new BaseError(code, message, extendedMessage);
    if (issues && Array.isArray(issues) && issues.length > 0) {
      issues.forEach(issue => result.addIssue(BaseError.parse(issue)));
    }

    return result;
  }

  public static stringify(baseError: BaseError): string {
    const result = {
      ...baseError,
      issues: [] as string[],
      code: String(baseError.code),
      message: baseError.message,
      extendedMessage: baseError.extendedMessage
    };

    if (
      baseError.issues &&
      Array.isArray(baseError.issues) &&
      baseError.issues.length > 0
    ) {
      result.issues = baseError.issues.reduce(
        (ret: string[], issue: ZodIssue) => {
          let error!: BaseError;
          /*if (!BaseError.isBaseError(issue)) {
          error = new FieldValidationError(
            issue.path,
            issue.code,
            issue.message,
            issue.fatal
          )
        } else {;*/
          if (BaseError.isBaseError(issue)) {
            error = issue as BaseError;

            ret.push(BaseError.stringify(error));
          }

          return ret;
        },
        []
      );
    }

    return JSON.stringify(result);
  }

  public static isBaseError = (error: unknown): error is BaseError =>
    (error as BaseError)?.__typename === "BaseError";

  public override name = "Error";
  public code: BaseErrorCode;

  public readonly __typename = "BaseError";

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

  public override get stack(): string {
    return new StackTracey(this.stack).withSources().toString();
  }
}
