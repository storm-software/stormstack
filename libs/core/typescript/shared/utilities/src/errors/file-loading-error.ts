import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

export class FileLoadingError extends BaseError {
  public override name = "File Loading Error";

  public constructor(
    public fileName: string,
    extendedMessage = "The file could not be loaded properly."
  ) {
    super(
      BaseErrorCode.failed_to_load_file,
      `Failed to load file '${fileName}'.
${extendedMessage}`
    );
  }
}
