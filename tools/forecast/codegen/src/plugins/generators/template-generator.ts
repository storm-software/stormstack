import { compile } from "handlebars";
import { AstNode } from "langium";
import { CompilerOptions } from "ts-morph";
import {
  Context,
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
  public get name(): string {
    return "TemplateGenerator";
  }

  protected templates = new Map<string, HandlebarsTemplateDelegate>();

  constructor(compilerOptions?: CompilerOptions) {
    super(compilerOptions);
  }

  public async generate(
    options: TOptions,
    node: AstNode,
    context: Context,
    params: { name: string; template: string }
  ): Promise<string> {
    const template = await this.getTemplate(params.name, params.template);

    return template(node);
  }

  protected async getTemplate(
    name: string,
    template: string
  ): Promise<HandlebarsTemplateDelegate> {
    let compiled = this.templates.get(name);
    if (!compiled) {
      compiled = compile(template, this.compilerOptions);
      this.templates.set(name, compiled);
    }

    return compiled;
  }
}
