import { HttpStatusCode } from "../errors/http-status-codes";

export function isStatusCodeSuccessful(
  statusCode: HttpStatusCode | number,
  allowRedirect = false
): boolean {
  return (
    statusCode >= 200 &&
    (statusCode <= 299 || (allowRedirect && statusCode <= 399))
  );
}

export function isStatusCodeValidationFailure(
  statusCode: HttpStatusCode | number
): boolean {
  return statusCode >= 400 && statusCode <= 499;
}

export function isStatusCodeServerError(
  statusCode: HttpStatusCode | number
): boolean {
  return statusCode >= 500;
}
