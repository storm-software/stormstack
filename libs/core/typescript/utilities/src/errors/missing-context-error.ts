import { BaseError } from "./base-error";

/**
 * Represents an error caused by an api call i.e. it has attributes for a HTTP status code
 * and the returned body object.
 *
 * Example
 * API returns a ErrorMessageObject whenever HTTP status code is not in [200, 299]
 * => ApiException(404, someErrorMessageObject)
 *
 */
export class MissingContextError extends BaseError {
  public name = "MissingContextError";

  public constructor(public contextName: string) {
    super(
      "This component cannot be rendered without a parent context.",
      `Missing context: ${contextName}`
    );
  }
}
