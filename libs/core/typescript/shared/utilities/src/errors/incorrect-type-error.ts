import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

/**
 *
 * @export
 * @class IncorrectTypeError
 * @extends {Error}
 */
export class IncorrectTypeError extends BaseError {
  public override name = "Incorrect Type Error";

  constructor(
    message?: string,
    code: BaseErrorCode = BaseErrorCode.type_error,
    extendedMessage?: string
  ) {
    super(
      code,
      message ? message : "The type of the value is incorrect.",
      extendedMessage
    );
  }
}
