import { ConsoleLogger } from "@stormstack/core-shared-logging";
import {} from "@stormstack/core-shared-utilities";
import * as Handlebars from "handlebars";
import { HelperOptions } from "handlebars";
import { AstNode } from "langium";
import { CompilerOptions } from "ts-morph";
import {
  Context,
  TemplateGeneratorHelper,
  TemplatePluginOptions,
  TypescriptPluginOptions
} from "../../types";
import {
  camelCaseHelper,
  capitalizeHelper,
  constantCaseHelper,
  forEachAttributeArgsHelper,
  forEachHelper,
  isApiModelHelper,
  isArrayFieldHelper,
  isArrayHelper,
  isArrayLengthHelper,
  isBigIntFieldHelper,
  isBooleanFieldHelper,
  isBytesFieldHelper,
  isCuidHelper,
  isDataModelFieldHelper,
  isDataModelHelper,
  isDateTimeFieldHelper,
  isDecimalFieldHelper,
  isDefaultAttributeHelper,
  isEnumHelper,
  isEnumReferenceHelper,
  isFloatFieldHelper,
  isFunctionDeclHelper,
  isIdAttributeHelper,
  isInputHelper,
  isIntegerFieldHelper,
  isInterfaceHelper,
  isInvocationHelper,
  isJsonFieldHelper,
  isLiteralHelper,
  isNowHelper,
  isOperationGroupHelper,
  isOptionalFieldHelper,
  isReferenceExprHelper,
  isRelationAttributeHelper,
  isSnowflakeHelper,
  isStringFieldHelper,
  isUniqueAttributeHelper,
  isUnsupportedFieldHelper,
  isUuidHelper,
  pascalCaseHelper
} from "../../utils/template-helpers";
import { TemplateDetails } from "../template-plugin-handler";
import { TypescriptGenerator } from "./typescript-generator";

/**
 * Base class for TypeScript generators
 */
export class TemplateGenerator<
  TOptions extends TemplatePluginOptions = TypescriptPluginOptions
> extends TypescriptGenerator<TOptions> {
  private _context?: Context;
  private _options?: TOptions;

  public get name(): string {
    return "Template Generator";
  }

  public get fileExtension() {
    return "*";
  }

  public get handlebars(): typeof Handlebars {
    return Handlebars;
  }

  protected templates = new Map<string, HandlebarsTemplateDelegate>();

  constructor(compilerOptions?: CompilerOptions) {
    super(compilerOptions);

    this.handlebars.registerHelper("isDataModel", isDataModelHelper);
    this.handlebars.registerHelper("isApiModel", isApiModelHelper);
    this.handlebars.registerHelper("isInterface", isInterfaceHelper);
    this.handlebars.registerHelper("isInput", isInputHelper);
    this.handlebars.registerHelper("isOperationGroup", isOperationGroupHelper);
    this.handlebars.registerHelper("isEnum", isEnumHelper);

    this.handlebars.registerHelper("isArrayField", isArrayFieldHelper);
    this.handlebars.registerHelper("isOptionalField", isOptionalFieldHelper);
    this.handlebars.registerHelper(
      "isUnsupportedField",
      isUnsupportedFieldHelper
    );

    this.handlebars.registerHelper("isDataModelField", isDataModelFieldHelper);
    this.handlebars.registerHelper("isIntegerField", isIntegerFieldHelper);
    this.handlebars.registerHelper("isFloatField", isFloatFieldHelper);
    this.handlebars.registerHelper("isDecimalField", isDecimalFieldHelper);
    this.handlebars.registerHelper("isBigIntField", isBigIntFieldHelper);
    this.handlebars.registerHelper("isStringField", isStringFieldHelper);
    this.handlebars.registerHelper("isBooleanField", isBooleanFieldHelper);
    this.handlebars.registerHelper("isDateTimeField", isDateTimeFieldHelper);
    this.handlebars.registerHelper("isBytesField", isBytesFieldHelper);
    this.handlebars.registerHelper("isJsonField", isJsonFieldHelper);

    this.handlebars.registerHelper(
      "isDefaultAttribute",
      isDefaultAttributeHelper
    );
    this.handlebars.registerHelper(
      "isUniqueAttribute",
      isUniqueAttributeHelper
    );
    this.handlebars.registerHelper("isIdAttribute", isIdAttributeHelper);
    this.handlebars.registerHelper(
      "isRelationAttribute",
      isRelationAttributeHelper
    );
    this.handlebars.registerHelper(
      "forEachAttributeArgs",
      forEachAttributeArgsHelper
    );

    this.handlebars.registerHelper("isNow", isNowHelper);
    this.handlebars.registerHelper("isUuid", isUuidHelper);
    this.handlebars.registerHelper("isCuid", isCuidHelper);
    this.handlebars.registerHelper("isSnowflake", isSnowflakeHelper);

    this.handlebars.registerHelper("isInvocation", isInvocationHelper);
    this.handlebars.registerHelper("isLiteral", isLiteralHelper);
    this.handlebars.registerHelper("isFunctionDecl", isFunctionDeclHelper);
    this.handlebars.registerHelper("isReferenceExpr", isReferenceExprHelper);
    this.handlebars.registerHelper("isEnumReference", isEnumReferenceHelper);

    this.handlebars.registerHelper("capitalize", capitalizeHelper);
    this.handlebars.registerHelper("camelCase", camelCaseHelper);
    this.handlebars.registerHelper("pascalCase", pascalCaseHelper);
    this.handlebars.registerHelper("constantCase", constantCaseHelper);

    this.handlebars.registerHelper("isArray", isArrayHelper);
    this.handlebars.registerHelper("isArrayLength", isArrayLengthHelper);
    this.handlebars.registerHelper("forEach", forEachHelper);
  }

  public generate = async (
    options: TOptions,
    node: AstNode,
    context: Context,
    params: TemplateDetails
  ): Promise<string> => {
    this._context = context;
    this._options = options;

    const template = await this.getTemplate(params);

    return template({ node, options });
  };

  public getContext(): Context {
    return this._context;
  }

  public getOptions(): TOptions {
    return this._options;
  }

  public registerHelper = (
    name: string,
    helper: TemplateGeneratorHelper
  ): void => {
    this.handlebars.registerHelper(
      name,
      (
        context?: any,
        arg1?: any,
        arg2?: any,
        arg3?: any,
        arg4?: any,
        arg5?: any,
        options?: HelperOptions
      ) =>
        helper(
          this.getContext,
          this.getOptions,
          context,
          arg1,
          arg2,
          arg3,
          arg4,
          arg5,
          options
        )
    );
  };

  protected getTemplate = async (
    template: TemplateDetails
  ): Promise<HandlebarsTemplateDelegate> => {
    let compiled = this.templates.get(template.name);
    if (!compiled) {
      ConsoleLogger.info(`Compiling template for ${template.name}`);

      compiled = this.handlebars.compile(
        template.content,
        this.compilerOptions
      );
      this.templates.set(template.name, compiled);
    }

    return compiled;
  };
}
