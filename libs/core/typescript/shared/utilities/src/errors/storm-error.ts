import { ZodIssue } from "zod";
import { isNumber } from "../common/type-checks";
import { IError } from "../types";
import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";
import { FieldError } from "./field-error";

/**
 *
 * @export
 * @class StormError
 * @extends {BaseError}
 *
 * A base class for all error types
 */
export class StormError extends BaseError implements IError {
  public static override parse(strBaseError: string): StormError {
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

    const result = new StormError(code, message, extendedMessage);
    if (issues && Array.isArray(issues) && issues.length > 0) {
      issues.forEach(issue => result.addIssue(StormError.parse(issue)));
    }

    return result;
  }

  public static override stringify(baseError: StormError): string {
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
          let error!: StormError;
          /*if (!BaseError.isBaseError(issue)) {
          error = new FieldValidationError(
            issue.path,
            issue.code,
            issue.message,
            issue.fatal
          )
        } else {;*/
          if (StormError.isStormError(issue)) {
            error = issue as StormError;

            ret.push(StormError.stringify(error));
          }

          return ret;
        },
        []
      );
    }

    return JSON.stringify(result);
  }

  public static isStormError = (error: unknown): error is StormError =>
    StormError.isBaseError(error) && error.__base === "StormError";

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

  public override readonly __typename = "StormError";

  private _fields: FieldError[] = [];

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public override get __base(): string {
    return "StormError";
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

  public override get message(): string {
    if (this._fields.length > 0) {
      return StormError.fieldErrorMessage(this._fields);
    }

    return this._message;
  }

  constructor(
    code: BaseErrorCode | string,
    message?: string,
    extendedMessage?: string,
    issues: StormError[] = [],
    fields: FieldError | FieldError[] = []
  ) {
    super(
      fields &&
        (!Array.isArray(fields) || (Array.isArray(fields) && fields.length > 0))
        ? BaseErrorCode.invalid_request
        : (code as any),
      fields &&
        (!Array.isArray(fields) || (Array.isArray(fields) && fields.length > 0))
        ? StormError.fieldErrorMessage(fields)
        : message,
      extendedMessage,
      issues
    );

    if (fields) {
      this._fields = Array.isArray(fields) ? fields : [fields];
    }

    this.code =
      this._fields.length > 0 ? BaseErrorCode.model_validation_error : code;
    this._message =
      (fields &&
      (!Array.isArray(fields) || (Array.isArray(fields) && fields.length > 0))
        ? StormError.fieldErrorMessage(fields)
        : message) ?? this._message;
    this.extendedMessage ??= this._message;
  }

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
}
