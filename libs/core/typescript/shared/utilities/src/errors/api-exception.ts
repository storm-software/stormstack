import { BaseError, BaseErrorCode } from "./base-error";

/**
 * Represents an error caused by an api call i.e. it has attributes for a HTTP status code
 * and the returned body object.
 *
 * Example
 * API returns a ErrorMessageObject whenever HTTP status code is not in [200, 299]
 * => ApiException(404, someErrorMessageObject)
 *
 */
export class ApiException<T> extends BaseError {
  public name = "API Exception";

  public constructor(
    public httpCode: number,
    message: string,
    public body?: T,
    public headers?: Headers
  ) {
    super(
      BaseErrorCode.invalid_return_type,
      message,
      "HTTP-Code: " +
        httpCode +
        "\nMessage: " +
        message +
        "\nBody: " +
        (body ? JSON.stringify(body) : "N/A") +
        "\nHeaders: " +
        (headers ? JSON.stringify(headers) : "N/A")
    );
  }
}
