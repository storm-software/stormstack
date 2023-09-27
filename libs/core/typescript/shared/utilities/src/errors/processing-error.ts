import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

export class ProcessingError extends BaseError {
  public override name = "Processing Error";

  public constructor(message: string, extendedMessage?: string) {
    super(BaseErrorCode.invalid_config, message, extendedMessage);
  }
}
