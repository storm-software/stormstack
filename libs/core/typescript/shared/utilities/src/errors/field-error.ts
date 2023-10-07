/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodIssue } from "zod";
import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

/**
 * The `FieldValidationError` class is a subclass of the `BaseError` class.
 * @export
 * @class FieldValidationError
 * @extends {Error}
 */
export class FieldError extends BaseError {
  /**
   * The line `public path!: Array<string | number>;` is declaring
   * a public property called `path` in the `FieldValidationError`
   * class. The `!` symbol is the non-null assertion operator, which
   * tells TypeScript that the property will be assigned a value
   * before it is used. In this case, it is used to indicate that the
   * `path` property to indicate that the `path` property will be
   * assigned a value later in the constructor of the class.
   */
  public path!: Array<string | number>;

  /**
   * The `isFieldValidationError` method is a static method of
   * the `FieldValidationError` class. It is used to check if an error
   * object is an instance of `FieldValidationError`.
   */
  public static isFieldError = (error: unknown): error is FieldError =>
    BaseError.isBaseError(error) &&
    (error as FieldError)?.path &&
    Array.isArray((error as FieldError)?.path) &&
    (error as FieldError)?.path?.length > 0;

  public override name = "Field Validation Error";

  constructor(
    path: string | number | Array<string | number>,
    code: string | BaseErrorCode = BaseErrorCode.field_validation_error,
    message = "Field validation errors occured.",
    public isWarning = false,
    extendedMessage?: string
  ) {
    super(code, message, extendedMessage);

    this.path = Array.isArray(path) ? path : [path];
  }

  /**
   * The `toZodIssue` method is converting the `FieldValidationError`
   * object into a `ZodIssue` object.
   */
  public toZodIssue = () =>
    ({
      code: this.code as any,
      message: this.message,
      path: this.path
    } as ZodIssue);

  /**
   * The public static `fromZodIssue` method is a static method of
   * the `FieldValidationError` class. It is used to create a new instance
   * of `FieldValidationError` based on a `ZodIssue` object.
   */
  public static fromZodIssue = (zodIssue: ZodIssue) =>
    new FieldError(zodIssue.path, zodIssue.code, zodIssue.message);
}
