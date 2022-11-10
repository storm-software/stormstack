import { readFileSync } from "fs";
import type { Config, DefaultPlugin, Output } from "svgo";
import { printError, printInfo } from "../../../helper-utilities";
import { DownloadableFile } from "../../types";
import { LibsType } from "../global-libs";
import {
  DefaultPresetOverride,
  defaultPresetPlugins,
  DefaultPresetPluginsName,
  DefaultPresetPluginsParams,
  Plugins,
  PluginV1,
  PluginV2,
} from "./svgo.type";

export type InputDataType = Array<
  Record<string, any> & {
    type: string;
    value: { url: string } & { [key: string]: any };
  }
>;
export type OutputDataType = Array<
  InputDataType[0] & {
    value: DownloadableFile & { [key: string]: any };
  }
>;
export type OptionsType =
  | undefined
  | {
      svgo?: Omit<Config, "plugins"> &
        (
          | { plugins?: Array<DefaultPlugin | DefaultPlugin["name"]> }
          | { plugins: Array<PluginV1> }
        );
    };

function getSyntaxPlugin(plugins: NonNullable<Plugins>): "v1" | "v2" {
  return plugins.some(plugin => typeof plugin === "string" || "name" in plugin)
    ? "v2"
    : "v1";
}

function migrateSvgoPlugins(plugins?: Plugins): Array<PluginV2> {
  if (!plugins) {
    return [{ name: "preset-default" }];
  }

  if (getSyntaxPlugin(plugins) === "v2") {
    return plugins as Array<PluginV2>;
  }

  const { overrides, pluginsV2 } = (plugins as Array<PluginV1>).reduce<{
    overrides: DefaultPresetOverride;
    pluginsV2: Array<DefaultPlugin>;
  }>(
    (acc, plugin) => {
      const pluginName = Object.keys(plugin)[0];
      if (defaultPresetPlugins.includes(pluginName)) {
        acc.overrides[pluginName as DefaultPresetPluginsName] = plugin[
          pluginName as keyof PluginV1
        ] as DefaultPresetPluginsParams;
      } else {
        const params = plugin[pluginName as keyof PluginV1];
        if (params !== false) {
          acc.pluginsV2.push({
            name: pluginName,
            params: params,
          } as DefaultPlugin);
        }
      }
      return acc;
    },
    { overrides: {}, pluginsV2: [] }
  );
  return [
    {
      name: "preset-default",
      params: {
        overrides,
      },
    },
    ...pluginsV2,
  ];
}

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { SVGO, _ }: Pick<LibsType, "SVGO" | "_" | "SpServices">
): Promise<OutputDataType | Error> {
  try {
    printInfo("Running Svgo Parser");
    options = options || {};
    options.svgo = options?.svgo || {};
    options.svgo.plugins = migrateSvgoPlugins(options.svgo.plugins);
    printInfo(JSON.stringify(tokens, null, 2));

    return (await Promise.all(
      tokens.map(async token => {
        if (token.type === "vector" && token.value.format === "svg") {
          printInfo(token.value.url);

          const baseString = readFileSync(token.value.url, "utf8");

          try {
            const result: Output = SVGO.optimize(
              baseString,
              options?.svgo as Config
            );
            token.value.content = result.data!;
          } catch (err) {
            printError(err);

            token.value.content = baseString;
          }
          return { ...token, value: _.omit(token.value, ["url"]) };
        }

        return token;
      })
    )) as OutputDataType;
  } catch (err) {
    printError(err);

    throw err;
  }
}
