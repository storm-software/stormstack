import { BaseError, BaseErrorCode } from "./base-error";

export class ConfigurationError extends BaseError {
  public name = "Configuration Error";

  public constructor(
    public configurationName: string,
    extendedMessage = "This configuration data is required for the system to run properly."
  ) {
    super(
      BaseErrorCode.invalid_config,
      `Required configuration data '${configurationName}' is missing.`,
      extendedMessage
    );
  }
}
