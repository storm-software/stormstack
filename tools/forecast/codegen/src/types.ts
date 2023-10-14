import { MaybePromise } from "@stormstack/core-shared-utilities";
import { AstNode, Model } from "@stormstack/tools-forecast-language/ast";
import { HelperOptions } from "handlebars/runtime";

export interface Context {
  /**
   * The model to be generated
   */
  model: Model;

  /**
   * The path to the schema file
   */
  schemaPath?: string;

  /**
   * The options used by forecast during generation
   * that is read from the forecast config file
   */
  config: ForecastConfig;
}

export interface IGenerator<TOptions extends PluginOptions = PluginOptions> {
  extendModel(context: Context): Promise<Model>;
  generate(
    options: TOptions,
    node: AstNode,
    context: Context,
    params?: any
  ): Promise<string>;
  write(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension?: string
  ): Promise<void>;
}

export const GENERATOR_SYMBOL = Symbol("Generator");

export type PluginHandler<TOptions extends PluginOptions = PluginOptions> = (
  options: TOptions,
  context: Context,
  generator: IGenerator<TOptions>
) => MaybePromise<void>;

export type PluginExtend<TOptions extends PluginOptions = PluginOptions> = (
  options: TOptions,
  context: Context
) => MaybePromise<Model>;

export const PLUGIN_RUNNER_SYMBOL = Symbol("PluginRunner");

/**
 * Plugin configuration option value type
 */
export type OptionValue = string | number | boolean;

/**
 * Plugin configuration options
 */
export type PluginOptions = {
  /**
   * The name of the provider
   */
  provider: string;

  /**
   * The output directory
   */
  output?: string;
} & Record<string, OptionValue | OptionValue[]>;

/**
 * TypeScript Plugin configuration options
 */
export type TypescriptPluginOptions = PluginOptions & {
  /**
   * Should the generated TypeScript files be compiled
   */
  compile?: boolean;

  /**
   * Should the generated TypeScript files be preserved
   */
  preserveTsFiles?: boolean;

  /**
   * Should prettier be used to format the generated code
   *
   * @default true
   */
  prettier?: boolean;
};

/**
 * Paths to template files for a Template Plugin
 */
export type TemplatePluginPaths = {
  /**
   * The path to the template files. This can include a [glob](https://www.npmjs.com/package/glob) pattern.
   */
  templatePath?: string | string[];

  /**
   * The path to the data model template files. For each data model a file will be generated.
   */
  dataModelTemplatePath?: string | string[];

  /**
   * The path to the input template files. For each input a file will be generated.
   */
  inputTemplatePath?: string | string[];

  /**
   * The path to the operation group template files. For each operation group a file will be generated.
   */
  operationGroupsTemplatePath?: string | string[];

  /**
   * The path to the API model template files. For each API model a file will be generated.
   */
  apiModelTemplatePath?: string | string[];

  /**
   * The path to the interface template files. For each interface a file will be generated.
   */
  interfaceTemplatePath?: string | string[];

  /**
   * The path to the enum template files. For each enum a file will be generated.
   */
  enumTemplatePath?: string | string[];
};

/**
 * Template Plugin options
 */
export type TemplatePluginOptions = PluginOptions &
  Partial<TemplatePluginPaths>;

export type TemplateGeneratorHelper = (
  getContext: () => Context,
  getOptions: () => TemplatePluginOptions,
  context?: any,
  arg1?: any,
  arg2?: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  options?: HelperOptions
) => any;

/**
 * Plugin module structure used in codegen
 */
export type PluginModule<TOptions extends PluginOptions = PluginOptions> = {
  /**
   * The display name of the plugin
   */
  name?: string;

  /**
   * The default options for the plugin
   */
  options?: TOptions;

  /**
   * A reference to the plugin extend function to extend the model based on pre-defined logic
   */
  extend?: PluginExtend<TOptions>;

  /**
   * A reference to the plugin generator used to generate the code based on the forecast model
   */
  generator?: IGenerator<TOptions>;

  /**
   * A reference to the plugin runner
   */
  handle?: PluginHandler<TOptions>;

  /**
   * A list of dependencies that should be installed
   */
  dependencies?: string[];
};

/**
 * Forecast configuration options
 */
export type ForecastConfig = {
  /**
   * The default options for all plugins
   */
  defaultOptions?: Omit<PluginOptions, "provider">;

  /**
   * The output directory
   */
  outDir: string;
} & Record<string, OptionValue | OptionValue[]>;
