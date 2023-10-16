import { BaseUtilityClass } from "@stormstack/core-shared-utilities";
import { AstNode, Model } from "@stormstack/tools-forecast-language/ast";
import { getFileHeader } from "../../code-gen";
import {
  Context,
  GENERATOR_SYMBOL,
  IGenerator,
  PluginOptions
} from "../../types";

/**
 * Forecast base Generator
 */
export abstract class Generator<TOptions extends PluginOptions = PluginOptions>
  extends BaseUtilityClass
  implements IGenerator
{
  public abstract get name(): string;

  public abstract get fileExtension(): string | "*";

  public abstract get commentStart(): string;

  public get __base(): string {
    return "Generator";
  }

  constructor() {
    super(GENERATOR_SYMBOL);
  }

  public abstract generate(
    options: TOptions,
    node: AstNode,
    context: Context,
    params: any
  ): Promise<string>;

  public write(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension?: string
  ): Promise<void> {
    return this.innerWrite(
      options,
      `
${this.getFileHeader()}

${fileContent}

${this.getFileFooter()}
  `,
      fileName,
      fileExtension ? fileExtension : this.fileExtension
    );
  }

  public abstract save(options: TOptions): Promise<void>;

  public async extendModel(context: Context): Promise<Model> {
    return context.model;
  }

  protected abstract innerWrite(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension: string
  ): Promise<void>;

  protected getFileHeader(): string {
    return getFileHeader(this.name, this.commentStart);
  }

  protected getFileFooter(): string {
    return "";
  }
}
