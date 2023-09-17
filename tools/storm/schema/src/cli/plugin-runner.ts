/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ConsoleLogger } from "@open-system/core-shared-logging/console";
import { isPlugin, Plugin } from "@open-system/tools-storm-language/ast";
import type { DMMF } from "@prisma/generator-helper";
import chalk from "chalk";
import fs from "fs";
// import ora from "ora";
import path from "path";
import { ensureDefaultOutputFolder } from "../plugins/plugin-utils";
import {
  getDataModels,
  getDMMF,
  getLiteral,
  getLiteralArray,
  hasValidationAttributes,
  PluginError,
  PluginFunction,
  PluginOptions,
  resolvePath
} from "../sdk";
import type { Context } from "../types";
import { getVersion } from "../utils/version-utils";
import { config } from "./config";

type PluginInfo = {
  name: string;
  provider: string;
  options: PluginOptions;
  run: PluginFunction;
  dependencies: string[];
  module: any;
};

/**
 * Storm plugin runner
 */
export class PluginRunner {
  /**
   * Runs a series of nested generators
   */
  async run(context: Context): Promise<void> {
    const version = getVersion();
    ConsoleLogger.info(
      chalk.bold(`⌛️ Storm CLI v${version}, running plugins`)
    );

    ConsoleLogger.debug("Ensuring default output folder exists and is empty");

    ensureDefaultOutputFolder();

    const plugins: PluginInfo[] = [];
    const pluginDecls = context.schema.declarations.filter((d): d is Plugin =>
      isPlugin(d)
    );

    ConsoleLogger.debug(
      `Loading schema from ${chalk.bold(context.schemaPath)}`
    );

    let prismaOutput = resolvePath("./prisma/schema.prisma", {
      schemaPath: context.schemaPath,
      name: ""
    });

    ConsoleLogger.debug(`Validating ${pluginDecls.length} Plugins from model`);

    for (const pluginDecl of pluginDecls) {
      const pluginProvider = this.getPluginProvider(pluginDecl);
      if (!pluginProvider) {
        ConsoleLogger.error(
          `Plugin ${pluginDecl.name} has invalid provider option`
        );
        throw new PluginError(
          "",
          `Plugin ${pluginDecl.name} has invalid provider option`
        );
      }
      const pluginModulePath = this.getPluginModulePath(pluginProvider);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let pluginModule: any;
      try {
        pluginModule = require(pluginModulePath);
      } catch (err) {
        ConsoleLogger.error(
          `Unable to load plugin module ${pluginProvider}: ${pluginModulePath}, ${err}`
        );
        throw new PluginError(
          "",
          `Unable to load plugin module ${pluginProvider}`
        );
      }

      if (!pluginModule.default || typeof pluginModule.default !== "function") {
        ConsoleLogger.error(
          `Plugin provider ${pluginProvider} is missing a default function export`
        );
        throw new PluginError(
          "",
          `Plugin provider ${pluginProvider} is missing a default function export`
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
          throw new PluginError(
            pluginName,
            `Invalid option value for ${f.name}`
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
          throw new PluginError(
            plugin.name,
            `Plugin ${plugin.provider} depends on "${dep}" but it's not declared`
          );
        }
      }
    }

    const warnings: string[] = [];

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

  private getPluginDependencies(pluginModule: any) {
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
    //const spinner = ora(`Running plugin ${chalk.cyan(name)}`).start();
    try {
      let result = run(context.schema, options, dmmf, config);
      if (result instanceof Promise) {
        result = await result;
      }
      if (Array.isArray(result)) {
        warnings.push(...result);
      }

      // spinner.succeed();
    } catch (err) {
      ConsoleLogger.error(err);
      //spinner.fail();
      throw err;
    }
  }

  private getPluginModulePath(provider: string) {
    let pluginModulePath = provider;
    if (pluginModulePath.startsWith("@core/")) {
      pluginModulePath = pluginModulePath.replace(
        /^@core\//,
        path.join(__dirname, "../../../storm/schema/plugins/")
      );
    }
    if (pluginModulePath.startsWith("@plugins/")) {
      pluginModulePath = pluginModulePath.replace(
        /^@plugins\//,
        path.join(__dirname, "../../../storm/plugins/")
      );
    }
    return pluginModulePath;
  }
}
