import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";

/**
 *
 * @export
 * @class DatabaseError
 * @extends {Error}
 */
export class DatabaseError extends BaseError {
  public override name = "Database Execution Error";

  constructor(public operationName?: string | null, issues: BaseError[] = []) {
    super(
      BaseErrorCode.database_query_error,
      `A database error occured while executing ${
        operationName ? `"${operationName}"` : "an operation"
      }.`
    );

    this.addIssues(issues);
  }
}
