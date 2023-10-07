/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Stacktracey requires buffer, which Vite does not polyfill by default
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  window.Buffer = window.Buffer || globalThis?.Buffer; // || require("node:buffer").Buffer;
}

import StackTracey from "stacktracey";

import { ZodError, ZodIssue } from "zod";
import { isNumber } from "../common/type-checks";
import { IError } from "../types";
import { BaseErrorCode } from "./error-codes";
import { FieldError } from "./field-error";

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
    (error as BaseError)?.__base === "BaseError";

  public static fieldErrorMessage = (fields: FieldError | FieldError[]) =>
    `The provided data model has failed one or more validations. Please review the following fields: ${(Array.isArray(
      fields
    )
      ? fields
      : [fields]
    )
      .map(field =>
        field.path.map((path, i) =>
          i < field.path.length - 1
            ? isNumber(path)
              ? `[${path}]`
              : `${path}.`
            : path
        )
      )
      .join(", ")}`;

  public override name = "System Error";
  public code: string | BaseErrorCode;
  public readonly __typename = "BaseError";

  private _fields: FieldError[] = [];
  private _message: string;

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public get __base(): string {
    return "BaseError";
  }

  /**
   * The function returns an array of FieldValidationError objects by mapping over an array of issues
   * and converting them if necessary.
   * @returns The `fieldErrors` method returns an array of `FieldValidationError` objects.
   */
  public get fields(): FieldError[] {
    return this._fields.map(issue =>
      FieldError.isFieldError(issue) ? issue : FieldError.fromZodIssue(issue)
    );
  }

  public override get stack(): string {
    return new StackTracey(this.stack).withSources().toString();
  }

  public override get message(): string {
    if (this._fields.length > 0) {
      return BaseError.fieldErrorMessage(this._fields);
    }

    return this._message;
  }

  constructor(
    code: BaseErrorCode | string,
    message?: string,
    public extendedMessage?: string,
    issues: BaseError[] = [],
    fields: FieldError | FieldError[] = []
  ) {
    super([
      {
        message:
          (fields &&
          (!Array.isArray(fields) ||
            (Array.isArray(fields) && fields.length > 0))
            ? BaseError.fieldErrorMessage(fields)
            : message) ?? "A system error has occured.",
        code:
          fields &&
          (!Array.isArray(fields) ||
            (Array.isArray(fields) && fields.length > 0))
            ? BaseErrorCode.invalid_request
            : (code as any),
        path: []
      },
      ...issues.map(issue => ({
        message: issue.message,
        code: issue.code as any,
        path: []
      }))
    ]);

    if (fields) {
      this._fields = Array.isArray(fields) ? fields : [fields];
    }

    this.code =
      this._fields.length > 0 ? BaseErrorCode.model_validation_error : code;
    this._message =
      (fields &&
      (!Array.isArray(fields) || (Array.isArray(fields) && fields.length > 0))
        ? BaseError.fieldErrorMessage(fields)
        : message) ?? "A system error has occured.";
    this.extendedMessage ??= message;
  }

  public isSameError = (other: unknown): boolean =>
    this.code === (other as BaseError)?.code &&
    this.name === (other as BaseError)?.name;

  public addField = (
    code = BaseErrorCode.missing_issue_code,
    message: string,
    path: Array<string | number> = [],
    isWarning = false
  ) => {
    this.addFieldError(new FieldError(path, code, message, isWarning));
  };

  public addFields = (
    fields: Array<{
      code: BaseErrorCode | string;
      message?: string;
      path: Array<string | number>;
      isWarning?: boolean;
    }>
  ) => {
    this.addFieldErrors(
      fields.map(
        field =>
          new FieldError(
            field.path,
            field.code,
            field.message,
            !!field.isWarning
          )
      )
    );
  };

  public addFieldError = (error: FieldError) => {
    this.addFieldErrors([error]);
  };

  public addFieldErrors = (errors: Array<FieldError>) => {
    this._fields.push(...errors);
  };

  public override addIssue = (
    issue: Pick<BaseError, "message"> &
      Partial<Pick<BaseError, "code">> & { path?: Array<string | number> }
  ) => {
    this.issues.push({
      message: issue.message,
      code: issue.code as any,
      path: []
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
