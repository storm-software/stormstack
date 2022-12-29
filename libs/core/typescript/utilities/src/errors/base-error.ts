import { IError } from "../types";

/**
 *
 * @export
 * @class BaseError
 * @extends {Error}
 *
 * A base class for all error types
 */
export class BaseError extends Error implements IError {
  public name = "Error";

  constructor(public message: string, public extendedMessage?: string) {
    super(message);

    this.extendedMessage ??= message;
  }
}
