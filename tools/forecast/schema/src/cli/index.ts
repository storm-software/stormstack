/* eslint-disable @typescript-eslint/no-explicit-any */
import { PackageManagers } from "@stormstack/core-server-utilities/package-fns";
import { ForecastLanguageMetaData } from "@stormstack/tools-forecast-language/module";
import chalk from "chalk";
import { Command, Option } from "commander";
import fs from "fs";
import * as semver from "semver";
import { getVersion } from "../utils/version-utils";
import { CliError } from "./cli-error";
import { dumpInfo, initProject, runPlugins } from "./cli-util";
import { loadConfig } from "./config";

// required minimal version of Prisma
export const requiredPrismaVersion = "4.0.0";

const DEFAULT_CONFIG_FILE = "storm.config.json";

export const initAction = async (
  projectPath: string,
  options: {
    prisma: string | undefined;
    packageManager: PackageManagers | undefined;
    tag?: string;
  }
): Promise<void> => {
  return initProject(
    projectPath,
    options.prisma,
    options.packageManager,
    options.tag
  );
};

export const infoAction = async (projectPath: string): Promise<void> => {
  return dumpInfo(projectPath);
};

export const generateAction = async (options: {
  schema: string;
  packageManager: PackageManagers | undefined;
  dependencyCheck: boolean;
  outDir?: string;
}): Promise<void> => {
  if (options.dependencyCheck) {
    checkRequiredPackage("prisma", requiredPrismaVersion);
    checkRequiredPackage("@prisma/client", requiredPrismaVersion);
  }
  return runPlugins(options);
};

const checkRequiredPackage = (packageName: string, minVersion?: string) => {
  let packageVersion: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    packageVersion = require(`${packageName}/package.json`).version;
  } catch (error) {
    console.error(chalk.red(`${packageName} not found, please install it`));
    throw new CliError(`${packageName} not found`);
  }

  if (minVersion && semver.lt(packageVersion, minVersion)) {
    console.error(
      chalk.red(
        `${packageName} needs to be above ${minVersion}, the installed version is ${packageVersion}, please upgrade it`
      )
    );
    throw new CliError(`${packageName} version is too low`);
  }
};

export function createProgram() {
  const program = new Command("storm");

  program.version(getVersion(), "-v --version", "display CLI version");

  const schemaExtensions = ForecastLanguageMetaData.fileExtensions.join(", ");

  program
    .description(
      `${chalk.bold.blue(
        "⚡"
      )} Forecast is a Prisma power pack for building full-stack apps.\n\nDocumentation: https://patsullivan.org.`
    )
    .showHelpAfterError()
    .showSuggestionAfterError();

  const schemaOption = new Option(
    "--schema <file>",
    `schema file (with extension ${schemaExtensions})`
  ).default("./schema.storm");

  const configOption = new Option("-c, --config [file]", "config file");

  const pmOption = new Option(
    "-p, --package-manager <pm>",
    "package manager to use"
  ).choices(["npm", "yarn", "pnpm"]);

  const noDependencyCheck = new Option(
    "--no-dependency-check",
    "do not check if dependencies are installed"
  );

  program
    .command("info")
    .description("Get information of installed Forecast and related packages.")
    .argument("[path]", "project path", ".")
    .action(infoAction);

  program
    .command("init")
    .description("Initialize an existing project for Forecast.")
    .addOption(configOption)
    .addOption(pmOption)
    .addOption(
      new Option(
        "--prisma <file>",
        "location of Prisma schema file to bootstrap from"
      )
    )
    .addOption(
      new Option(
        "--tag [tag]",
        "the NPM package tag to use when installing dependencies"
      )
    )
    .argument("[path]", "project path", ".")
    .action(initAction);

  program
    .command("generate")
    .description("Run code generation.")
    .addOption(schemaOption)
    .addOption(configOption)
    .addOption(pmOption)
    .addOption(noDependencyCheck)
    .action(generateAction);

  // make sure config is loaded before actions run
  program.hook("preAction", async (_, actionCommand) => {
    let configFile: string | undefined = actionCommand.opts().config;

    if (!configFile && fs.existsSync(DEFAULT_CONFIG_FILE)) {
      configFile = DEFAULT_CONFIG_FILE;
    }

    if (configFile) {
      loadConfig(configFile);
    }
  });

  return program;
}

export default async function (): Promise<void> {
  const program = createProgram();
  program.exitOverride();

  await program.parseAsync(process.argv);
}
