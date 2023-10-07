import { Tree, createProjectGraphAsync, workspaceRoot } from "@nx/devkit";
import {
  SemverReleaseType,
  isRelativeVersionKeyword,
  parseVersion
} from "@stormstack/core-server-utilities/semver-fns";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import {
  BaseErrorCode,
  ConfigurationError,
  EnvConfigurationError,
  FieldError,
  StormError,
  parseBoolean
} from "@stormstack/core-shared-utilities";
import { execSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { URL } from "node:url";
import { ReleaseGeneratorSchema } from "./schema";

const LARGE_BUFFER = 1024 * 1000000;

export default async function (tree: Tree, options?: ReleaseGeneratorSchema) {
  try {
    ConsoleLogger.showTitle();
    ConsoleLogger.info("Running 🎉 Nx-Monorepo Release Generator...");
    ConsoleLogger.info(`Current Working Dir: ${process.cwd()}`);
    const { local, force } = options;

    const registry = getRegistry();
    const registryIsLocalhost = registry.hostname === "localhost";
    if (!local) {
      if (!process.env.GH_TOKEN) {
        throw new EnvConfigurationError("GH_TOKEN");
      }
      if (!force && registryIsLocalhost) {
        throw new ConfigurationError(
          "Registry",
          'Registry is still set to localhost! Run "pnpm local-registry disable" or pass --force'
        );
      }
    } else {
      if (!force && !registryIsLocalhost) {
        const error = new StormError(
          BaseErrorCode.invalid_request,
          "--local was passed and registry is not localhost"
        );
        error.addFieldError(new FieldError("local"));

        throw error;
      }
    }

    // Perform minimal logging by default
    let isVerboseLogging = parseBoolean(process.env.NX_VERBOSE_LOGGING);

    if (options.clearLocalRegistry) {
      rmSync(join(__dirname, "../dist/local-registry/storage"), {
        recursive: true,
        force: true
      });
    }

    const buildCommand = "pnpm build";
    ConsoleLogger.log(`> ${buildCommand}`);
    execSync(buildCommand, {
      stdio: [0, 1, 2],
      maxBuffer: LARGE_BUFFER
    });

    // Ensure all the native-packages directories are available at the top level of the build directory, enabling consistent packageRoot structure
    /*execSync(`pnpm nx copy-native-package-directories nx`, {
      stdio: isVerboseLogging ? [0, 1, 2] : "ignore",
      maxBuffer: LARGE_BUFFER
    });*/

    // Expected to run as part of the Github `publish` workflow
    if (!options.local && process.env.NPM_TOKEN) {
      // Delete all .node files that were built during the previous steps
      // Always run before the artifacts step because we still need the .node files for native-packages
      execSync('find ./build -name "*.node" -delete', {
        stdio: [0, 1, 2],
        maxBuffer: LARGE_BUFFER
      });

      execSync("pnpm nx run-many --target=artifacts", {
        stdio: [0, 1, 2],
        maxBuffer: LARGE_BUFFER
      });
    }

    const runNxReleaseVersion = () => {
      let versionCommand = `pnpm nx release version${
        options.version ? ` --specifier ${options.version}` : ""
      }`;
      if (options.dryRun) {
        versionCommand += " --dry-run";
      }
      ConsoleLogger.log(`> ${versionCommand}`);
      execSync(versionCommand, {
        stdio: isVerboseLogging ? [0, 1, 2] : "ignore",
        maxBuffer: LARGE_BUFFER
      });
    };

    // Intended for creating a github release which triggers the publishing workflow
    if (!options.local && !process.env.NPM_TOKEN) {
      // For this important use-case it makes sense to always have full logs
      isVerboseLogging = true;

      execSync("git status --ahead-behind");

      if (isRelativeVersionKeyword(options.version)) {
        throw new Error(
          "When creating actual releases, you must use an exact semver version"
        );
      }

      runNxReleaseVersion();

      let changelogCommand = `pnpm nx release changelog ${options.version} --tagVersionPrefix="" --interactive`;
      if (options.from) {
        changelogCommand += ` --from ${options.from}`;
      }
      if (options.gitRemote) {
        changelogCommand += ` --git-remote ${options.gitRemote}`;
      }
      if (options.dryRun) {
        changelogCommand += " --dry-run";
      }
      ConsoleLogger.log(`> ${changelogCommand}`);
      execSync(changelogCommand, {
        stdio: isVerboseLogging ? [0, 1, 2] : "ignore",
        maxBuffer: LARGE_BUFFER
      });

      ConsoleLogger.log(
        "Check github: https://github.com/nrwl/nx/actions/workflows/publish.yml"
      );
      process.exit(0);
    }

    runNxReleaseVersion();

    if (options.dryRun) {
      ConsoleLogger.warn("Not Publishing because --dryRun was passed");
    } else {
      // If publishing locally, force all projects to not be private first
      if (options.local) {
        ConsoleLogger.log(
          "\nPublishing locally, so setting all resolved packages to not be private"
        );
        const projectGraph = await createProjectGraphAsync();
        for (const proj of Object.values(projectGraph.nodes)) {
          if (proj.data.targets?.["nx-release-publish"]) {
            const packageJsonPath = join(
              workspaceRoot,
              proj.data.targets?.["nx-release-publish"]?.options.packageRoot,
              "package.json"
            );
            try {
              const packageJson = require(packageJsonPath);
              if (packageJson.private) {
                ConsoleLogger.log(
                  "- Publishing private package locally:",
                  packageJson.name
                );
                writeFileSync(
                  packageJsonPath,
                  JSON.stringify({ ...packageJson, private: false })
                );
              }
            } catch {}
          }
        }
      }

      const distTag = determineDistTag(options.version);

      // Run with dynamic output-style so that we have more minimal logs by default but still always see errors
      let publishCommand = `pnpm nx release publish --registry=${getRegistry()} --tag=${distTag} --output-style=dynamic --parallel=8`;
      if (options.dryRun) {
        publishCommand += " --dry-run";
      }
      ConsoleLogger.log(`\n> ${publishCommand}`);
      execSync(publishCommand, {
        stdio: [0, 1, 2],
        maxBuffer: LARGE_BUFFER
      });
    }

    ConsoleLogger.success(`StormStack Nx-Monorepo Release successfully ran.`);
  } catch (e) {
    ConsoleLogger.error(`An error occurred executing Nx-Monorepo Release`);
    ConsoleLogger.error(e);
  }
}

function getRegistry() {
  return new URL(execSync("npm config get registry").toString().trim());
}

function determineDistTag(newVersion: string): "latest" | "next" | "previous" {
  // For a relative version keyword, it cannot be previous
  if (isRelativeVersionKeyword(newVersion)) {
    const prereleaseKeywords: SemverReleaseType[] = [
      "premajor",
      "preminor",
      "prepatch",
      "prerelease"
    ];
    return prereleaseKeywords.includes(newVersion) ? "next" : "latest";
  }

  const parsedGivenVersion = parseVersion(newVersion);
  if (!parsedGivenVersion) {
    throw new Error(
      `Unable to parse the given version: "${newVersion}". Is it valid semver?`
    );
  }

  const currentLatestVersion = execSync("npm view nx version")
    .toString()
    .trim();
  const parsedCurrentLatestVersion = parseVersion(currentLatestVersion);
  if (!parsedCurrentLatestVersion) {
    throw new Error(
      `The current version resolved from the npm registry could not be parsed (resolved "${currentLatestVersion}")`
    );
  }

  const distTag =
    parsedGivenVersion.prerelease.length > 0
      ? "next"
      : parsedGivenVersion.major < parsedCurrentLatestVersion.major
      ? "previous"
      : "latest";

  return distTag;
}
