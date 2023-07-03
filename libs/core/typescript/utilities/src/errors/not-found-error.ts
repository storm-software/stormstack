import { BaseError } from "./base-error";

/**
 *
 * @export
 * @class NotFoundError
 * @extends {Error}
 */
export class NotFoundError extends BaseError {
  public name = "Not Found Error";

  constructor(public objectName: string) {
    super(`No ${objectName} object could be found`);
  }
}
