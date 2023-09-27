import { ValidationAcceptor } from "langium";
import { Attribute } from "../generated/ast";
import { AstValidator } from "../types";

/**
 * Validates attribute declarations.
 */
export default class AttributeValidator implements AstValidator<Attribute> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  validate(attr: Attribute, accept: ValidationAcceptor): void {}
}
