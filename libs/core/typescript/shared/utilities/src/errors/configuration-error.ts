import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

export class ConfigurationError extends BaseError {
  public override name = "Configuration Error";

  public constructor(
    public configurationName: string,
    extendedMessage = "This configuration data is required for the system to run properly."
  ) {
    super(
      BaseErrorCode.invalid_config,
      `Required configuration data '${configurationName}' is invalid.`,
      extendedMessage
    );
  }
}
