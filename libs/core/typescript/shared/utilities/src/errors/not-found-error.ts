import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

const DEFAULT_OBJECT_NAME = "record(s)";

/**
 *
 * @export
 * @class NotFoundError
 * @extends {Error}
 */
export class NotFoundError extends BaseError {
  public override name = "Not Found Error";

  constructor(public objectName: string | null = DEFAULT_OBJECT_NAME) {
    super(
      BaseErrorCode.record_not_found,
      `No ${objectName ? objectName : DEFAULT_OBJECT_NAME} could be found`
    );
  }
}
