/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodIssue } from "zod";
import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

/**
 *
 * @export
 * @class FieldValidationError
 * @extends {Error}
 */
export class FieldValidationError extends BaseError {
  public override name = "Field Validation Error";

  constructor(
    public path: Array<string | number>,
    code = BaseErrorCode.field_validation_error,
    message = "Field validation errors occured.",
    public fatal = true,
    extendedMessage?: string
  ) {
    super(code, message, extendedMessage);
  }

  public toZodIssue = () =>
    ({
      code: this.code as any,
      message: this.message,
      path: this.path
    } as ZodIssue);
}
