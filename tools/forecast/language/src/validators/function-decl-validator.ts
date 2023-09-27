import { ValidationAcceptor } from "langium";
import { FunctionDecl } from "../ast";
import { AstValidator } from "../types";
import { validateAttributeApplication } from "../utils";

/**
 * Validates function declarations.
 */
export default class FunctionDeclValidator
  implements AstValidator<FunctionDecl>
{
  validate(funcDecl: FunctionDecl, accept: ValidationAcceptor) {
    funcDecl.attributes.forEach(attr => {
      validateAttributeApplication(attr, accept);
    });
  }
}
