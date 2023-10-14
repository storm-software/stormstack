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

  public get handlebars(): typeof Handlebars {
    return Handlebars;
  }

  protected templates = new Map<string, HandlebarsTemplateDelegate>();

  constructor(compilerOptions?: CompilerOptions) {
    super(compilerOptions);
  }

  public generate = async (
    options: TOptions,
    node: AstNode,
    context: Context,
    params: { name: string; template: string }
  ): Promise<string> => {
    this._context = context;
    this._options = options;

    const template = await this.getTemplate(params.name, params.template);

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
    name: string,
    template: string
  ): Promise<HandlebarsTemplateDelegate> => {
    let compiled = this.templates.get(name);
    if (!compiled) {
      compiled = this.handlebars.compile(template, this.compilerOptions);
      this.templates.set(name, compiled);
    }

    return compiled;
  };

  /*private isDataModel = (node: AstNode, options: HelperOptions) => {
  }*/
}
