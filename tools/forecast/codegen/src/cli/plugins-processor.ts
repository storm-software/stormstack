/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { DMMF } from "@prisma/generator-helper";
import { resolvePath } from "@stormstack/core-server-utilities/file-path-fns";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { ProcessingError } from "@stormstack/core-shared-utilities";
import { isPlugin, Plugin } from "@stormstack/tools-forecast-language/ast";
import { getLiteral } from "@stormstack/tools-forecast-language/utils";
import chalk from "chalk";
import path from "path";
import type {
  Context,
  ForecastConfig,
  IGenerator,
  IPluginRunner,
  PluginModule,
  PluginOptions
} from "../types";
import { ensureDefaultOutputFolder } from "../utils/plugin-utils";
import { getVersion } from "../utils/version-utils";
import { config } from "./config";

type PluginInfo = {
  name: string;
  dependencyOf?: string;
  provider: string;
  options: PluginOptions;
  generator: IGenerator;
  runner: IPluginRunner;
  dependencies: string[];
  module: any;
};

/**
 * Storm plugin runner
 */
export class PluginsProcessor {
  private _plugins: PluginInfo[] = [];

  /**
   * Runs a series of nested generators
   */
  public async process(context: Context): Promise<void> {
    const version = getVersion();
    ConsoleLogger.info(
      chalk.bold(`⌛️ Forecast CLI v${version} - Processing Plugins`)
    );

    ConsoleLogger.debug("Ensuring default output folder exists and is empty");
    ensureDefaultOutputFolder();

    const plugins: PluginInfo[] = [];
    const pluginDecls = context.model.declarations.filter((d): d is Plugin =>
      isPlugin(d)
    );

    ConsoleLogger.debug(
      `Loading Forecast schema from ${chalk.bold(context.schemaPath)}`
    );

    let prismaOutput = resolvePath(
      "./prisma/schema.prisma",
      context.schemaPath
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

        const pluginInfoList = this.getPluginInfo(
          pluginProvider,
          context.config.defaultOptions
        );

        this._plugins = pluginInfoList.reduce(
          (ret: PluginInfo[], pluginInfo: PluginInfo) => {
            if (!ret.some(p => p.provider === pluginInfo.provider)) {
              ret.push(pluginInfo);
            }

            return ret;
          },
          this._plugins
        );
      }

      ConsoleLogger.info(
        `Running ${this._plugins} plugins (${
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

      /*for (const pluginInfo of this._plugins) {
        let pluginModule: PluginModule;
        try {
          pluginModule = require(pluginModulePath);
        } catch (err) {
          ConsoleLogger.error(
            `Unable to load plugin module ${pluginProvider}: ${pluginModulePath}, ${err}`
          );
          throw new ProcessingError(
            `Unable to load plugin module ${pluginProvider}`
          );
        }

        if (!pluginModule) {
          ConsoleLogger.error(`Plugin provider ${pluginProvider} is missing`);
          throw new ProcessingError(
            `Plugin provider ${pluginProvider} is missing`
          );
        }
        if (!pluginModule.generator) {
          ConsoleLogger.error(
            `Plugin provider ${pluginProvider} is missing a "generator" export`
          );
          throw new ProcessingError(
            `Plugin provider ${pluginProvider} is missing a "generator" export`
          );
        }
        if (!pluginModule.runner) {
          ConsoleLogger.error(
            `Plugin provider ${pluginProvider} is missing a "runner" export`
          );
          throw new ProcessingError(
            `Plugin provider ${pluginProvider} is missing a "runner" export`
          );
        }

        const dependencies = this.getPluginDependencies(pluginModule);
        const pluginName = this.getPluginName(pluginModule, pluginProvider);
        const options: PluginOptions = {
          schemaPath: context.schemaPath,
          name: pluginName
        };

        ConsoleLogger.debug(
          `Preparing to load plugin:
${JSON.stringify(options)}`
        );

        pluginDecl.fields.forEach(f => {
          const value = getLiteral(f.value) ?? getLiteralArray(f.value);
          if (value === undefined) {
            throw new ProcessingError(
              `${pluginName} Plugin: Invalid option value for ${f.name}`
            );
          }
          options[f.name] = value;
        });

        const plugin = {
          name: pluginName,
          provider: pluginProvider,
          dependencies,
          options,
          run: pluginModule.default as PluginFunction,
          module: pluginModule
        };

        ConsoleLogger.debug(
          `Loading plugin:
${JSON.stringify(plugin)}`
        );

        plugins.push(plugin);

        if (
          pluginProvider === "@core/prisma" &&
          typeof options.output === "string"
        ) {
          // record custom prisma output path
          prismaOutput = resolvePath(options.output, options);
        }
      }

      // make sure prerequisites are included
      const corePlugins: Array<{
        provider: string;
        options?: Record<string, unknown>;
      }> = [
        { provider: "@core/prisma" },
        { provider: "@core/model-meta" },
        { provider: "@core/access-policy" }
      ];

      if (
        getDataModels(context.schema).some(model =>
          hasValidationAttributes(model)
        )
      ) {
        // '@core/zod' plugin is auto-enabled if there're validation rules
        corePlugins.push({
          provider: "@plugins/zod",
          options: { modelOnly: true }
        });
      }

      // core plugins introduced by dependencies
      plugins
        .flatMap(p => p.dependencies)
        .forEach(dep => {
          if (dep.startsWith("@core/")) {
            const existing = corePlugins.find(p => p.provider === dep);
            if (existing) {
              // reset options to default
              existing.options = undefined;
            } else {
              // add core dependency
              corePlugins.push({ provider: dep });
            }
          }
        });

      for (const corePlugin of corePlugins.reverse()) {
        const existingIdx = plugins.findIndex(
          p => p.provider === corePlugin.provider
        );
        if (existingIdx >= 0) {
          // shift the plugin to the front
          const existing = plugins[existingIdx];
          plugins.splice(existingIdx, 1);
          plugins.unshift(existing);
        } else {
          // synthesize a plugin and insert front
          const pluginModule = require(this.getPluginModulePath(
            corePlugin.provider
          ));
          const pluginName = this.getPluginName(
            pluginModule,
            corePlugin.provider
          );
          plugins.unshift({
            name: pluginName,
            provider: corePlugin.provider,
            dependencies: [],
            options: {
              schemaPath: context.schemaPath,
              name: pluginName,
              ...corePlugin.options
            },
            run: pluginModule.default,
            module: pluginModule
          });
        }
      }

      // check dependencies
      for (const plugin of plugins) {
        for (const dep of plugin.dependencies) {
          if (!plugins.find(p => p.provider === dep)) {
            ConsoleLogger.error(
              `Plugin ${plugin.provider} depends on "${dep}" but it's not declared`
            );
            throw new ProcessingError(
              `Plugin ${plugin.name}: ${plugin.provider} depends on "${dep}" but it's not declared`
            );
          }
        }
      }

      let dmmf: DMMF.Document | undefined = undefined;
      for (const { name, provider, run, options } of plugins) {
        const start = Date.now();
        await this.runPlugin(name, run, context, options, dmmf, warnings);
        ConsoleLogger.log(
          `✅ Plugin ${chalk.bold(name)} (${provider}) completed in ${
            Date.now() - start
          }ms`
        );
        if (provider === "@core/prisma") {
          // load prisma DMMF
          dmmf = await getDMMF({
            datamodel: fs.readFileSync(prismaOutput, { encoding: "utf-8" })
          });
        }
      }*/
    } else {
      ConsoleLogger.warn(
        `No plugins specified for this model. Skipping plugin processing (please ensure this is correct).`
      );
    }

    ConsoleLogger.log(
      chalk.green(chalk.bold("\n⚡ All plugins completed successfully!"))
    );

    warnings.forEach(w => ConsoleLogger.warn(chalk.yellow(w)));

    ConsoleLogger.log(
      `Don't forget to restart your dev server to let the changes take effect.`
    );
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

  private async runPlugin(
    name: string,
    run: PluginFunction,
    context: Context,
    options: PluginOptions,
    dmmf: DMMF.Document | undefined,
    warnings: string[]
  ) {
    ConsoleLogger.info(`Executing plugin ${chalk.bold.cyan(name)}`);

    try {
      const result = Promise.resolve(run(context.model, options, dmmf, config));
      if (Array.isArray(result)) {
        warnings.push(...result);
      }

      ConsoleLogger.success("Plugin completed successfully");
    } catch (err) {
      ConsoleLogger.error("Plugin failed to complete");
      ConsoleLogger.error(err);

      throw err;
    }
  }

  private getPluginModulePath(provider: string) {
    let pluginModulePath = provider;
    if (pluginModulePath.startsWith("@core/")) {
      pluginModulePath = pluginModulePath.replace(
        /^@core\//,
        path.join(__dirname, "../../../forecast/schema/plugins/")
      );
    }
    if (pluginModulePath.startsWith("@plugins/")) {
      pluginModulePath = pluginModulePath.replace(
        /^@plugins\//,
        path.join(__dirname, "../../../forecast/plugins/")
      );
    }
    return pluginModulePath;
  }

  private getPluginModule(pluginProvider: string): PluginModule {
    if (!pluginProvider) {
      ConsoleLogger.error(
        `Plugin ${pluginProvider} has invalid provider option`
      );
      throw new ProcessingError(
        `Plugin ${pluginProvider} has invalid provider option`
      );
    }

    const pluginModulePath = this.getPluginModulePath(pluginProvider);

    let pluginModule: PluginModule;
    try {
      pluginModule = require(pluginModulePath);
    } catch (err) {
      ConsoleLogger.error(
        `Unable to load plugin module ${pluginProvider}: ${pluginModulePath}, ${err}`
      );
      throw new ProcessingError(
        `Unable to load plugin module ${pluginProvider}`
      );
    }

    if (!pluginModule) {
      ConsoleLogger.error(`Plugin provider ${pluginProvider} is missing`);
      throw new ProcessingError(`Plugin provider ${pluginProvider} is missing`);
    }
    if (!pluginModule.generator) {
      ConsoleLogger.error(
        `Plugin provider ${pluginProvider} is missing a "generator" export`
      );
      throw new ProcessingError(
        `Plugin provider ${pluginProvider} is missing a "generator" export`
      );
    }
    if (!pluginModule.runner) {
      ConsoleLogger.error(
        `Plugin provider ${pluginProvider} is missing a "runner" export`
      );
      throw new ProcessingError(
        `Plugin provider ${pluginProvider} is missing a "runner" export`
      );
    }

    return pluginModule;
  }

  private getPluginInfo(
    pluginProvider: string,
    pluginOptions: ForecastConfig["defaultOptions"]
  ): PluginInfo[] {
    const module: PluginModule = this.getPluginModule(pluginProvider);
    const name = this.getPluginName(module, pluginProvider);

    const dependencies = this.getPluginDependenciesList(module);
    const pluginInfo: PluginInfo = {
      name,
      provider: pluginProvider,
      module,
      options: {
        ...module.options,
        ...pluginOptions
      },
      generator: module.generator,
      runner: module.runner,
      dependencies
    };
    if (!dependencies) {
      return [pluginInfo];
    }

    return [
      ...dependencies.reduce((ret: PluginInfo[], dep: string) => {
        if (
          !this._plugins.some(p => p.provider === dep) &&
          !ret.some(p => p.provider === dep)
        ) {
          ret.push(
            ...{
              ...this.getPluginInfo(dep, pluginInfo.options),
              dependencyOf: name
            }
          );
        }

        return ret;
      }, []),
      pluginInfo
    ];
  }
}