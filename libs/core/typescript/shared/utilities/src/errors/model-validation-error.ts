import { isNumber } from "../common";
import { BaseError } from "./base-error";
import { BaseErrorCode } from "./error-codes";
import { FieldValidationError } from "./field-validation-error";

/**
 *
 * @export
 * @class ModelValidationError
 * @extends {Error}
 */
export class ModelValidationError extends BaseError {
  public override name = "Model Validation Error";

  constructor(
    fields: FieldValidationError[],
    code: BaseErrorCode = BaseErrorCode.model_validation_error
  ) {
    super(
      code,
      `The data model has failed one or more validations. Please review the following fields: ${fields
        .map(field =>
          field.path.map((path, i) =>
            i < field.path.length - 1
              ? isNumber(path)
                ? `[${path}]`
                : `${path}.`
              : path
          )
        )
        .join(", ")}`
    );

    this.issues = fields.map(field => field.toZodIssue());
  }
}
