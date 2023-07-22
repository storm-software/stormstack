import { BaseError } from "./base-error";

export class FileLoadingError extends BaseError {
  public name = "File Loading Error";

  public constructor(
    public fileName: string,
    extendedMessage = "The file could not be loaded properly."
  ) {
    super(`Failed to load file '${fileName}'`, extendedMessage);
  }
}
