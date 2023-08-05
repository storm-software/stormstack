import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

/**
 *
 * @export
 * @class NotFoundError
 * @extends {Error}
 */
export class NotFoundError extends BaseError {
  public override name = "Not Found Error";

  constructor(public objectName: string) {
    super(
      BaseErrorCode.record_not_found,
      `No ${objectName} object could be found`
    );
  }
}
