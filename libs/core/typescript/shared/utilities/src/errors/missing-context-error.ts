import { BaseErrorCode } from "./error-codes";
import { StormError } from "./storm-error";

/**
 * Represents an error caused by an api call i.e. it has attributes for a HTTP status code
 * and the returned body object.
 *
 * Example
 * API returns a ErrorMessageObject whenever HTTP status code is not in [200, 299]
 * => ApiException(404, someErrorMessageObject)
 *
 */
export class MissingContextError extends StormError {
  public override name = "Missing Context Error";

  public constructor(public contextName: string) {
    super(
      BaseErrorCode.missing_context,
      `This component cannot be rendered without a parent context.
Missing context: ${contextName}`
    );
  }
}
