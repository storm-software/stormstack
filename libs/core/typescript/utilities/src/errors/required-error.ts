import { BaseError } from "./base-error";

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends BaseError {
  public name = "RequiredError";

  constructor(
    public field: string,
    public method?: string,
    public process?: string
  ) {
    super(
      `Required parameter ${field} is missing`,
      `Required parameter ${field} was null or undefined ${
        process || method
          ? ` when calling ${
              process && method ? `${process}.${method}` : process ?? method
            }`
          : ""
      }.`
    );
  }
}
