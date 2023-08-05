import { ZodError } from "zod";
import { IError } from "../types";
import { BaseErrorCode } from "./error-codes";

/**
 *
 * @export
 * @class BaseError
 * @extends {Error}
 *
 * A base class for all error types
 */
export class BaseError extends ZodError implements IError {
  public override name = "Error";
  public code: BaseErrorCode;

  constructor(
    code = BaseErrorCode.missing_issue_code,
    message: string,
    public extendedMessage?: string
  ) {
    super([{ message, code: code as any, path: [] }]);

    this.code = code;
    this.extendedMessage ??= message;
  }

  public isSameError = (other: unknown): boolean =>
    this.name === (other as BaseError)?.name;
}
