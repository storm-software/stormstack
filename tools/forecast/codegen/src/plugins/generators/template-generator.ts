import { ConsoleLogger } from "@stormstack/core-shared-logging";
import {
  isApiModel,
  isDataModel,
  isEnum,
  isInput,
  isInterface,
  isOperationGroup
} from "@stormstack/tools-forecast-language/ast";
import * as Handlebars from "handlebars";
import { HelperOptions } from "handlebars";
import { utils } from "handlebars-utils";
import { AstNode } from "langium";
import { CompilerOptions } from "ts-morph";
import {
  Context,
  TemplateGeneratorHelper,
  TemplatePluginOptions,
  TypescriptPluginOptions
} from "../../types";
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
    return "TemplateGenerator";
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

    this.handlebars.registerHelper("isDataModel", this.isDataModel);
    this.handlebars.registerHelper("isApiModel", this.isApiModel);
    this.handlebars.registerHelper("isInterface", this.isInterface);
    this.handlebars.registerHelper("isInput", this.isInput);
    this.handlebars.registerHelper("isOperationGroup", this.isOperationGroup);
    this.handlebars.registerHelper("isEnum", this.isEnum);
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

    return template(node);
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
      ConsoleLogger.info(
        `Compiling template for ${template.name}:
${template.content}`
      );

      compiled = this.handlebars.compile(
        template.content,
        this.compilerOptions
      );
      this.templates.set(template.name, compiled);
    }

    return compiled;
  };

  private isDataModel = (node: AstNode, options: HelperOptions) => {
    utils.value(isDataModel(node), options);
  };

  private isApiModel = (node: AstNode, options: HelperOptions) => {
    utils.value(isApiModel(node), options);
  };

  private isInterface = (node: AstNode, options: HelperOptions) => {
    utils.value(isInterface(node), options);
  };

  private isInput = (node: AstNode, options: HelperOptions) => {
    utils.value(isInput(node), options);
  };

  private isOperationGroup = (node: AstNode, options: HelperOptions) => {
    utils.value(isOperationGroup(node), options);
  };

  private isEnum = (node: AstNode, options: HelperOptions) => {
    utils.value(isEnum(node), options);
  };
}
