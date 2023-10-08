import { BaseErrorCode } from "./error-codes";
import { StormError } from "./storm-error";

export class ProcessingError extends StormError {
  public override name = "Processing Error";

  public constructor(message: string, extendedMessage?: string) {
    super(BaseErrorCode.invalid_config, message, extendedMessage);
  }
}
