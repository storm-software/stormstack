import { findFileName } from "@stormstack/core-server-utilities";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import * as Handlebars from "handlebars";
import { HelperOptions } from "handlebars";
import { AstNode } from "langium";
import {
  Context,
  TemplateGeneratorHelper,
  TemplatePluginOptions,
  TypeScriptGeneratorConfig,
  TypescriptPluginOptions
} from "../../types";
import {
  camelCaseHelper,
  capitalizeHelper,
  constantCaseHelper,
  eachDataModelHelper,
  forEachHelper,
  isApiModelHelper,
  isArrayExprHelper,
  isArrayFieldHelper,
  isArrayHelper,
  isArrayLengthHelper,
  isBigIntFieldHelper,
  isBooleanFieldHelper,
  isBytesFieldHelper,
  isContainsAttributeHelper,
  isCountryCodeAttributeHelper,
  isCuidHelper,
  isDataModelHelper,
  isDateTimeFieldHelper,
  isDatetimeAttributeHelper,
  isDecimalFieldHelper,
  isDefaultAttributeHelper,
  isEmailAttributeHelper,
  isEndsWithAttributeHelper,
  isEnumHelper,
  isEnumReferenceHelper,
  isEqualHelper,
  isFloatFieldHelper,
  isForeignKeyFieldHelper,
  isFunctionDeclHelper,
  isGtAttributeHelper,
  isGteAttributeHelper,
  isHasAttributeHelper,
  isHasEveryAttributeHelper,
  isHasSomeAttributeHelper,
  isIdAttributeHelper,
  isInputHelper,
  isIntegerFieldHelper,
  isInterfaceHelper,
  isInternalFieldHelper,
  isInvocationHelper,
  isIpAttributeHelper,
  isIsEmptyAttributeHelper,
  isJsonFieldHelper,
  isLatitudeAttributeHelper,
  isLengthAttributeHelper,
  isLiteralHelper,
  isLongitudeAttributeHelper,
  isLtAttributeHelper,
  isLteAttributeHelper,
  isMacAttributeHelper,
  isModelFieldHelper,
  isModelHelper,
  isMultipleOfAttributeHelper,
  isNowHelper,
  isOperationGroupHelper,
  isOptionalFieldHelper,
  isPhoneNumberAttributeHelper,
  isPostalCodeAttributeHelper,
  isReferenceExprHelper,
  isRegexAttributeHelper,
  isRelationAttributeHelper,
  isSemverAttributeHelper,
  isSnowflakeHelper,
  isStartsWithAttributeHelper,
  isStringFieldHelper,
  isTimeZoneAttributeHelper,
  isUniqueAttributeHelper,
  isUnsupportedFieldHelper,
  isUrlAttributeHelper,
  isUuidHelper,
  pascalCaseHelper,
  snakeCaseHelper,
  withForeignKeyHelper
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
  protected partials: string[] = [];

  constructor(config?: TypeScriptGeneratorConfig) {
    super(config);

    this.handlebars.registerHelper("isDataModel", isDataModelHelper);
    this.handlebars.registerHelper("isApiModel", isApiModelHelper);
    this.handlebars.registerHelper("isInterface", isInterfaceHelper);
    this.handlebars.registerHelper("isInput", isInputHelper);
    this.handlebars.registerHelper("isOperationGroup", isOperationGroupHelper);
    this.handlebars.registerHelper("isEnum", isEnumHelper);
    this.handlebars.registerHelper("isModel", isModelHelper);

    this.handlebars.registerHelper("eachDataModel", eachDataModelHelper);

    this.handlebars.registerHelper("isArrayField", isArrayFieldHelper);
    this.handlebars.registerHelper("isOptionalField", isOptionalFieldHelper);
    this.handlebars.registerHelper(
      "isUnsupportedField",
      isUnsupportedFieldHelper
    );
    this.handlebars.registerHelper(
      "isForeignKeyField",
      isForeignKeyFieldHelper
    );

    this.handlebars.registerHelper("isModelField", isModelFieldHelper);
    this.handlebars.registerHelper("isIntegerField", isIntegerFieldHelper);
    this.handlebars.registerHelper("isFloatField", isFloatFieldHelper);
    this.handlebars.registerHelper("isDecimalField", isDecimalFieldHelper);
    this.handlebars.registerHelper("isBigIntField", isBigIntFieldHelper);
    this.handlebars.registerHelper("isStringField", isStringFieldHelper);
    this.handlebars.registerHelper("isBooleanField", isBooleanFieldHelper);
    this.handlebars.registerHelper("isDateTimeField", isDateTimeFieldHelper);
    this.handlebars.registerHelper("isBytesField", isBytesFieldHelper);
    this.handlebars.registerHelper("isJsonField", isJsonFieldHelper);
    this.handlebars.registerHelper("isInternalField", isInternalFieldHelper);

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
    this.handlebars.registerHelper("isEmailAttribute", isEmailAttributeHelper);
    this.handlebars.registerHelper("isUrlAttribute", isUrlAttributeHelper);
    this.handlebars.registerHelper("isIpAttribute", isIpAttributeHelper);
    this.handlebars.registerHelper("isMacAttribute", isMacAttributeHelper);
    this.handlebars.registerHelper(
      "isPhoneNumberAttribute",
      isPhoneNumberAttributeHelper
    );
    this.handlebars.registerHelper(
      "isSemverAttribute",
      isSemverAttributeHelper
    );
    this.handlebars.registerHelper(
      "isPostalCodeAttribute",
      isPostalCodeAttributeHelper
    );
    this.handlebars.registerHelper(
      "isLatitudeAttribute",
      isLatitudeAttributeHelper
    );
    this.handlebars.registerHelper(
      "isLongitudeAttribute",
      isLongitudeAttributeHelper
    );
    this.handlebars.registerHelper(
      "isCountryCodeAttribute",
      isCountryCodeAttributeHelper
    );
    this.handlebars.registerHelper(
      "isTimeZoneAttribute",
      isTimeZoneAttributeHelper
    );
    this.handlebars.registerHelper(
      "isDatetimeAttribute",
      isDatetimeAttributeHelper
    );
    this.handlebars.registerHelper("isHasAttribute", isHasAttributeHelper);
    this.handlebars.registerHelper(
      "isHasEveryAttribute",
      isHasEveryAttributeHelper
    );
    this.handlebars.registerHelper(
      "isHasSomeAttribute",
      isHasSomeAttributeHelper
    );
    this.handlebars.registerHelper(
      "isIsEmptyAttribute",
      isIsEmptyAttributeHelper
    );
    this.handlebars.registerHelper("isRegexAttribute", isRegexAttributeHelper);
    this.handlebars.registerHelper(
      "isLengthAttribute",
      isLengthAttributeHelper
    );
    this.handlebars.registerHelper("isGteAttribute", isGteAttributeHelper);
    this.handlebars.registerHelper("isGtAttribute", isGtAttributeHelper);
    this.handlebars.registerHelper("isLteAttribute", isLteAttributeHelper);
    this.handlebars.registerHelper("isLtAttribute", isLtAttributeHelper);
    this.handlebars.registerHelper(
      "isMultipleOfAttribute",
      isMultipleOfAttributeHelper
    );
    this.handlebars.registerHelper(
      "isContainsAttribute",
      isContainsAttributeHelper
    );
    this.handlebars.registerHelper(
      "isStartsWithAttribute",
      isStartsWithAttributeHelper
    );
    this.handlebars.registerHelper(
      "isEndsWithAttribute",
      isEndsWithAttributeHelper
    );

    this.handlebars.registerHelper("withForeignKey", withForeignKeyHelper);

    this.handlebars.registerHelper("isNow", isNowHelper);
    this.handlebars.registerHelper("isUuid", isUuidHelper);
    this.handlebars.registerHelper("isCuid", isCuidHelper);
    this.handlebars.registerHelper("isSnowflake", isSnowflakeHelper);

    this.handlebars.registerHelper("isInvocation", isInvocationHelper);
    this.handlebars.registerHelper("isLiteral", isLiteralHelper);
    this.handlebars.registerHelper("isFunctionDecl", isFunctionDeclHelper);
    this.handlebars.registerHelper("isReferenceExpr", isReferenceExprHelper);
    this.handlebars.registerHelper("isArrayExpr", isArrayExprHelper);
    this.handlebars.registerHelper("isEnumReference", isEnumReferenceHelper);

    this.handlebars.registerHelper("capitalize", capitalizeHelper);
    this.handlebars.registerHelper("camelCase", camelCaseHelper);
    this.handlebars.registerHelper("pascalCase", pascalCaseHelper);
    this.handlebars.registerHelper("constantCase", constantCaseHelper);
    this.handlebars.registerHelper("snakeCase", snakeCaseHelper);

    this.handlebars.registerHelper("isEqual", isEqualHelper);
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

    return template({ node, options, context });
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

  public registerPartial = (partial: TemplateDetails, name?: string) => {
    const partialName = name ? name : partial.name;

    if (!this.partials.includes(partialName)) {
      this.handlebars.registerPartial(partialName, partial.content);

      this.partials.push(partialName);
    }
  };

  public registerPartials = async (partials: Array<TemplateDetails>) =>
    Promise.all(
      partials.map(partial =>
        Promise.resolve(
          this.handlebars.registerPartial(
            findFileName(partial.name).replace(".hbs", ""),
            partial.content
          )
        )
      )
    );

  protected getTemplate = async (
    template: TemplateDetails
  ): Promise<HandlebarsTemplateDelegate> => {
    let compiled = this.templates.get(template.name);
    if (!compiled) {
      ConsoleLogger.info(`Compiling template for ${template.name}`);

      compiled = this.handlebars.compile(
        template.content,
        this.config.compiler
      );
      this.templates.set(template.name, compiled);
    }

    return compiled;
  };
}
