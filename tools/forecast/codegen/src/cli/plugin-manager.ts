/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { findFilePath } from "@stormstack/core-server-utilities/file-path-fns";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { JsonParser } from "@stormstack/core-shared-serialization";
import {
  NEWLINE_STRING,
  ProcessingError,
  getPrimaryColor,
  isSet
} from "@stormstack/core-shared-utilities";
import { Plugin, isPlugin } from "@stormstack/tools-forecast-language/ast";
import {
  getLiteral,
  getLiteralArray
} from "@stormstack/tools-forecast-language/utils";
import chalk from "chalk";
import path, { join } from "path";
import type {
  Context,
  ForecastConfig,
  PluginInfo,
  PluginModule
} from "../types";
import { ensureDefaultOutputFolder } from "../utils/plugin-utils";
import { getVersion } from "../utils/version-utils";

/**
 * Storm plugin runner
 */
export class PluginManager {
  private _plugins: PluginInfo[] = [];

  /**
   * Runs a series of nested generators
   */
  public async process(context: Context): Promise<void> {
    const version = getVersion();
    ConsoleLogger.info(
      chalk.bold(
        `⌛️ ${chalk
          .hex(getPrimaryColor())
          .bold(`Forecast CLI v${version}`)} - Processing Plugins`
      )
    );

    ConsoleLogger.debug("Ensuring default output folder exists and is empty");
    ensureDefaultOutputFolder();

    const pluginDecls = context.model.declarations.filter((d): d is Plugin =>
      isPlugin(d)
    );

    ConsoleLogger.debug(
      `Loading Forecast schema from ${chalk.bold(context.schemaPath)}`
    );

    const warnings: string[] = [];
    if (pluginDecls.length > 0) {
      ConsoleLogger.debug(
        `Loading ${pluginDecls.length} plugins specified in model`
      );

      for (const pluginDecl of pluginDecls) {
        const pluginProvider = this.getPluginProvider(pluginDecl);
        if (!pluginProvider) {
          ConsoleLogger.error(
            `Plugin ${pluginDecl.name} has invalid provider option`
          );
          throw new ProcessingError(
            `Plugin ${pluginDecl.name} has invalid provider option`
          );
        }

        const options = { ...context.config.defaultOptions };
        pluginDecl.fields.forEach(f => {
          const value = getLiteral(f.value) ?? getLiteralArray(f.value);
          if (value === undefined) {
            throw new ProcessingError(
              `${pluginDecl.name} Plugin: Invalid option value for ${f.name}`
            );
          }
          options[f.name] = value;
        });

        const pluginInfoList = await this.getPluginInfo(
          pluginProvider,
          options
        );

        this._plugins = pluginInfoList.reduce(
          (ret: PluginInfo[], pluginInfo: PluginInfo) => {
            if (
              !ret.some(p => p.provider === pluginInfo.provider) ||
              pluginInfo.provider === pluginProvider
            ) {
              pluginInfo.options.output = pluginInfo.options.output
                ? join(
                    context.config.outDir,
                    pluginInfo.options.output as string
                  )
                : context.config.outDir;
              pluginInfo.options.headerName ??= pluginInfo.name;

              ret.push({
                ...pluginInfo,
                pluginId:
                  pluginInfo.provider === pluginProvider
                    ? pluginDecl.name
                    : pluginInfo.provider
              });
            }

            return ret;
          },
          this._plugins
        );
      }

      ConsoleLogger.info(
        `Running ${this._plugins.length} plugins (${
          pluginDecls.length
        } specified in model, ${
          this._plugins.length - pluginDecls.length
        } dependencies)`,
        this._plugins
          .map(
            p =>
              `- ${p.provider} - ${p.name}${
                p.dependencyOf ? ` - Dependency of ${p.dependencyOf}` : ""
              }`
          )
          .join("\r\n")
      );

      // Format the plugins context
      context.plugins = {
        details: {}
      };

      context.plugins.details = this._plugins.reduce(
        (ret: Record<string, PluginInfo>, plugin: PluginInfo) => {
          ret[plugin.pluginId] = plugin;

          return ret;
        },
        {}
      );

      for (const pluginInfo of this._plugins) {
        context.plugins.current = pluginInfo.pluginId;

        if (pluginInfo.extend) {
          ConsoleLogger.info(
            `Extending model with ${chalk
              .hex(getPrimaryColor())
              .bold(pluginInfo.name)} plugin`
          );

          context.model = await Promise.resolve(
            pluginInfo.extend(pluginInfo.options, context)
          );
        }
      }

      for (const pluginInfo of this._plugins) {
        context.plugins.current = pluginInfo.pluginId;

        if (pluginInfo.handle && pluginInfo.generator) {
          ConsoleLogger.info(
            `Generating code with ${chalk
              .hex(getPrimaryColor())
              .bold(pluginInfo.name)} plugin`
          );

          await Promise.resolve(
            pluginInfo.handle(pluginInfo.options, context, pluginInfo.generator)
          );
        }
      }
    } else {
      ConsoleLogger.warn(
        "No plugins specified for this model. No processing will be performed (please ensure this is expected)."
      );
    }

    ConsoleLogger.log(
      chalk.hex(getPrimaryColor())(
        chalk.bold("⚡ All plugins completed successfully!")
      ) +
        chalk.gray(
          NEWLINE_STRING +
            "Don't forget to restart your dev server to let the changes take effect"
        )
    );

    warnings.forEach(w => ConsoleLogger.warn(chalk.yellow(w)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getPluginName(pluginModule: any, pluginProvider: string): string {
    return typeof pluginModule.name === "string"
      ? (pluginModule.name as string)
      : pluginProvider;
  }

  private getPluginDependenciesList(pluginModule: any) {
    return Array.isArray(pluginModule.dependencies)
      ? (pluginModule.dependencies as string[])
      : [];
  }

  private getPluginProvider(plugin: Plugin) {
    const providerField = plugin.fields.find(f => f.name === "provider");
    return getLiteral<string>(providerField?.value);
  }

  private getPluginModulePath(provider: string) {
    let pluginModulePath = provider;
    if (pluginModulePath.startsWith("@stormstack/")) {
      pluginModulePath = `file://${path.join(
        pluginModulePath.replace(
          "@stormstack/tools-forecast-plugins-",
          path.join(__dirname, "../../../../../forecast/plugins/")
        ),
        "index.cjs"
      )}`;
    }

    return pluginModulePath;
  }

  private async getPluginModule(pluginProvider: string): Promise<PluginModule> {
    if (!pluginProvider) {
      ConsoleLogger.error(
        `Plugin ${pluginProvider} has invalid provider option`
      );
      throw new ProcessingError(
        `Plugin ${pluginProvider} has invalid provider option`
      );
    }

    let pluginModule: PluginModule;
    let resolvedPath!: string;
    try {
      resolvedPath = pluginProvider;
      pluginModule = await import(resolvedPath);
    } catch (origError) {
      ConsoleLogger.debug(
        `Unable to load plugin module ${pluginProvider}: Tried to import from "${pluginProvider}", ${origError}`
      );

      resolvedPath = this.getPluginModulePath(pluginProvider);

      try {
        pluginModule = await import(resolvedPath);
      } catch (error) {
        ConsoleLogger.debug(
          `Unable to load plugin module ${pluginProvider}: Tried to import from "${resolvedPath}", ${error}`
        );

        ConsoleLogger.error(
          `Unable to load plugin module ${pluginProvider}: ${origError}`
        );
        throw new ProcessingError(
          `Unable to load plugin module ${pluginProvider}`,
          isSet(origError)
            ? `Error: ${JsonParser.stringify(origError)}`
            : undefined
        );
      }
    }

    if (!pluginModule) {
      ConsoleLogger.error(`Plugin provider ${pluginProvider} cannot be found`);
      throw new ProcessingError(
        `Plugin provider ${pluginProvider} cannot be found`
      );
    }

    if (!pluginModule.name) {
      ConsoleLogger.warn(
        `Plugin provider ${pluginProvider} is missing a "name" export`
      );
    }

    if (
      (pluginModule.handle && !pluginModule.generator) ||
      (!pluginModule.handle && pluginModule.generator)
    ) {
      ConsoleLogger.error(
        `Plugin provider ${pluginProvider} is missing a "generator" or "handle" export. If a one of the "generator" or "handle" exports are set, then both "generator" and "handle" must be set.`
      );
      throw new ProcessingError(
        `Plugin provider ${pluginProvider} is missing a "generator" or "handle" export. If a one of the "generator" or "handle" exports are set, then both "generator" and "handle" must be set.`
      );
    }

    if (!pluginModule.handle && !pluginModule.extend) {
      ConsoleLogger.warn(
        `Plugin provider ${pluginProvider} is missing both the "handle" and "extend" exports. If a plugin does not have a "handle" or "extend" export, then it will be ignored.`
      );
    }

    return { ...pluginModule, resolvedPath: findFilePath(resolvedPath) };
  }

  private async getPluginInfo(
    pluginProvider: string,
    pluginOptions: ForecastConfig["defaultOptions"]
  ): Promise<PluginInfo[]> {
    const module: PluginModule = await this.getPluginModule(pluginProvider);
    const name = this.getPluginName(module, pluginProvider);

    const dependencies = this.getPluginDependenciesList(module);
    const pluginInfo: PluginInfo = {
      ...module,
      module,
      pluginId: pluginProvider,
      name,
      provider: pluginProvider,
      options: {
        ...module.options,
        ...pluginOptions
      },
      dependencies
    };
    if (!dependencies) {
      return [pluginInfo];
    }

    const pluginInfoList: PluginInfo[] = [];
    for (const dependency of dependencies) {
      if (
        !this._plugins.some(p => p.provider === dependency) &&
        !pluginInfoList.some(p => p.provider === dependency)
      ) {
        const pluginInfoListItem = await this.getPluginInfo(
          dependency,
          pluginInfo.options
        );
        pluginInfoList.push(
          ...{
            ...pluginInfoListItem,
            dependencyOf: name
          }
        );
      }
    }

    return [...pluginInfoList, pluginInfo];
  }
}
