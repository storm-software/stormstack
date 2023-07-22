import { ConfigurationError } from "./configuration-error";

export class EnvConfigurationError extends ConfigurationError {
  public static formatExtendedMessage = (
    envName: string
  ) => `Missing ${envName} environment variable.
  If you're running locally, please ensure you have a ./.env file with a value for ${envName}=your-key.
  If you're running in Netlify, make sure you've configured env variable ${envName}.
  Please see README.md for more details on configuring your system.`;

  public constructor(envName: string) {
    super(envName, EnvConfigurationError.formatExtendedMessage(envName));
  }
}
