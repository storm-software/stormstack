import { BaseErrorCode } from "./error-codes";
import { StormError } from "./storm-error";

export class ConfigurationError extends StormError {
  public override name = "Configuration Error";

  public constructor(
    configurationName: string,
    extendedMessage = "This configuration data is required for the system to run properly."
  ) {
    super(
      BaseErrorCode.invalid_config,
      `Required configuration data '${configurationName}' is invalid.`,
      extendedMessage
    );
  }
}
