import {
  BaseUtilityClass,
  EMPTY_STRING,
  isString
} from "@stormstack/core-shared-utilities";
import { AstNode } from "@stormstack/tools-forecast-language/ast";
import { getFileFooter, getFileHeader } from "../../code-gen";
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
${this.getFileHeader(options)}

${fileContent}

${this.getFileFooter(options)}
  `,
      fileName,
      fileExtension ? fileExtension : this.fileExtension
    );
  }

  public abstract save(options: TOptions): Promise<void>;

  protected abstract innerWrite(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension: string
  ): Promise<void>;

  protected getFileHeader(options: TOptions): string {
    return options.header === false
      ? EMPTY_STRING
      : isString(options.header)
      ? options.header
      : getFileHeader(
          options.headerName ? options.headerName : this.name,
          this.commentStart
        );
  }

  protected getFileFooter(options: TOptions): string {
    return options.footer === false
      ? EMPTY_STRING
      : isString(options.footer)
      ? options.footer
      : getFileFooter(this.commentStart);
  }
}
