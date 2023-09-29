import {
  PluginHandler,
  type Context,
  type IGenerator,
  type PluginOptions
} from "../types";

/**
 * Runs the core functionality of a plugin generator
 */
export const createPluginHandler =
  <TOptions extends PluginOptions = PluginOptions>(
    fileName: string = "index"
  ): PluginHandler<TOptions> =>
  async (
    options: TOptions,
    context: Context,
    generator: IGenerator<TOptions>
  ) => {
    const fileContent = await generator.generate(
      options,
      context.model,
      context,
      {}
    );

    await generator.write(options, fileContent, fileName);
  };
