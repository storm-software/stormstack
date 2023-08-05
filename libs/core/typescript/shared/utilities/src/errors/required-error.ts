import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends BaseError {
  public override name = "Required Fields Error";

  constructor(
    public field: string,
    public method?: string,
    public process?: string
  ) {
    super(
      BaseErrorCode.required_field_missing,
      `Required parameter ${field} is missing.
Required parameter ${field} was null or undefined ${
        process || method
          ? ` when calling ${
              process && method ? `${process}.${method}` : process ?? method
            }`
          : ""
      }.`
    );
  }
}
