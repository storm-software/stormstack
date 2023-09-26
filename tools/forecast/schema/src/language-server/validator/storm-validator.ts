import {
  ApiModel,
  Attribute,
  DataModel,
  DataSource,
  Enum,
  Expression,
  FunctionDecl,
  Input,
  Interface,
  InvocationExpr,
  Model,
  OperationGroup,
  StormAstType
} from "@stormstack/tools-forecast-language/ast";
import {
  AstNode,
  LangiumDocument,
  ValidationAcceptor,
  ValidationChecks,
  ValidationRegistry
} from "langium";
import type { StormServices } from "../storm-module";
import ApiModelValidator from "./api-model-validator";
import AttributeValidator from "./attribute-validator";
import DataModelValidator from "./datamodel-validator";
import DataSourceValidator from "./datasource-validator";
import EnumValidator from "./enum-validator";
import ExpressionValidator from "./expression-validator";
import FunctionDeclValidator from "./function-decl-validator";
import FunctionInvocationValidator from "./function-invocation-validator";
import InputValidator from "./input-validator";
import InterfaceValidator from "./interface-validator";
import OperationGroupValidator from "./operation-group-validator";
import SchemaValidator from "./schema-validator";

/**
 * Registry for validation checks.
 */
export class StormValidationRegistry extends ValidationRegistry {
  constructor(services: StormServices) {
    super(services);
    const validator = services.validation.StormValidator;
    const checks: ValidationChecks<StormAstType> = {
      Model: validator.checkModel,
      DataSource: validator.checkDataSource,
      DataModel: validator.checkDataModel,
      ApiModel: validator.checkApiModel,
      Input: validator.checkInput,
      Interface: validator.checkInterface,
      OperationGroup: validator.checkOperationGroup,
      Enum: validator.checkEnum,
      Attribute: validator.checkAttribute,
      Expression: validator.checkExpression,
      InvocationExpr: validator.checkFunctionInvocation,
      FunctionDecl: validator.checkFunctionDecl
    };
    this.register(checks, validator);
  }
}

/**
 * Implementation of custom validations.
 */
export class StormValidator {
  constructor(protected readonly services: StormServices) {}
  private shouldCheck(node: AstNode) {
    let doc: LangiumDocument | undefined;
    let currNode: AstNode | undefined = node;
    while (currNode) {
      if (currNode.$document) {
        doc = currNode.$document;
        break;
      }
      currNode = currNode.$container;
    }

    return (
      doc?.parseResult.lexerErrors.length === 0 &&
      doc?.parseResult.parserErrors.length === 0
    );
  }

  checkModel(node: Model, accept: ValidationAcceptor): void {
    this.shouldCheck(node) &&
      new SchemaValidator(
        this.services.shared.workspace.LangiumDocuments
      ).validate(node, accept);
  }

  checkDataSource(node: DataSource, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new DataSourceValidator().validate(node, accept);
  }

  checkDataModel(node: DataModel, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new DataModelValidator().validate(node, accept);
  }

  checkApiModel(node: ApiModel, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new ApiModelValidator().validate(node, accept);
  }

  checkInterface(node: Interface, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new InterfaceValidator().validate(node, accept);
  }

  checkOperationGroup(node: OperationGroup, accept: ValidationAcceptor): void {
    this.shouldCheck(node) &&
      new OperationGroupValidator().validate(node, accept);
  }

  checkInput(node: Input, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new InputValidator().validate(node, accept);
  }

  checkEnum(node: Enum, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new EnumValidator().validate(node, accept);
  }

  checkAttribute(node: Attribute, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AttributeValidator().validate(node, accept);
  }

  checkExpression(node: Expression, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new ExpressionValidator().validate(node, accept);
  }

  checkFunctionInvocation(
    node: InvocationExpr,
    accept: ValidationAcceptor
  ): void {
    this.shouldCheck(node) &&
      new FunctionInvocationValidator().validate(node, accept);
  }

  checkFunctionDecl(node: FunctionDecl, accept: ValidationAcceptor): void {
    this.shouldCheck(node) &&
      new FunctionDeclValidator().validate(node, accept);
  }
}
