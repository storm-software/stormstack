import { ExecutorContext, workspaceRoot, writeJsonFile } from "@nx/devkit";
import { createLockFile, createPackageJson, getLockFileName } from "@nx/js";
import {
  copyFile,
  copyFiles,
  createCliOptions,
  executeAsync,
} from "@open-system/core-server-utilities";
import { ConsoleLogger } from "@open-system/core-shared-utilities";
import { ensureDirSync, existsSync, writeFileSync } from "fs-extra";
import type { PackageJson } from "nx/src/utils/package-json";
import Path from "path";
import { moveSchemasForDownload } from "./move-schemas-for-download";
import { EventCatalogBuildExecutorSchema } from "./schema";

export default async function (
  options: EventCatalogBuildExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Executing Event Catalog Build executor...");
    const {
      includeDevDependenciesInPackageJson,
      outputPath,
      generateLockfile,
    } = options;

    const buildTarget =
      context.workspace.projects[context.projectName].targets.build;

    if (existsSync(outputPath)) {
      result = await executeAsync(`rmdir /S /Q "${outputPath}" `);
      if (result) {
        ConsoleLogger.error(result);
        return { success: false };
      }
    }

    const packagePath = Path.join(__dirname, ".event-catalog");
    if (!existsSync(packagePath)) {
      ConsoleLogger.error(
        `Event Catalog website package path does not exist - "${packagePath}"`
      );
      return { success: false };
    }

    ConsoleLogger.info("Ensuring package path exists");
    ensureDirSync(packagePath);

    /*if (!existsSync(outputPath)) {
      mkdir(outputPath);
    }*/

    ConsoleLogger.info("Copying files from package path");
    copyFiles(packagePath, outputPath);
    copyFile(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "eventcatalog.config.js"
      ),
      Path.join(outputPath, "eventcatalog.config.js")
    );
    copyFiles(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "public"
      ),
      Path.join(outputPath, "public")
    );
    copyFiles(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "domains"
      ),
      Path.join(outputPath, "domains")
    );
    copyFiles(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "events"
      ),
      Path.join(outputPath, "events")
    );
    copyFiles(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "services"
      ),
      Path.join(outputPath, "services")
    );

    ConsoleLogger.info("Running Event Catalog Build");
    /*await executeAsync(
      `npx next dev ${outputPath} -p ${port} -H ${hostname ?? "localhost"} `,
      {
        cwd: outputPath,
      }
    );*/

    const builtPackageJson = createPackageJson(
      context.projectName,
      context.projectGraph,
      {
        target: context.targetName,
        root: context.root,
        isProduction: !includeDevDependenciesInPackageJson,
      }
    );

    // Update `package.json` to reflect how users should run the build artifacts
    builtPackageJson.scripts = {
      start: "next start",
    };

    updatePackageJson(builtPackageJson, context);
    writeJsonFile(`${outputPath}/package.json`, builtPackageJson);

    if (generateLockfile) {
      const lockFile = createLockFile(builtPackageJson);
      writeFileSync(`${outputPath}/${getLockFileName()}`, lockFile, {
        encoding: "utf-8",
      });
    }

    process.env["__NEXT_REACT_ROOT"] ||= "true";
    process.env.PROJECT_DIR = outputPath;

    await moveSchemasForDownload();

    const config = await import(
      Path.join(process.env.PROJECT_DIR, "eventcatalog.config.js")
    );

    const { generators = [] } = config;
    const plugins = [];

    for (const generator of generators) {
      const plugin = generator[0];
      const pluginConfig = generator[1];
      const { default: importedGenerator } = await import(plugin);

      ConsoleLogger.info(`Generating EventCatalog docs using: ${plugin}`);

      plugins.push(
        importedGenerator({ eventCatalogConfig: config }, pluginConfig)
      );
    }

    await Promise.all(plugins);

    await executeAsync(
      `npx next build ${createCliOptions({
        experimentalAppOnly: false,
        debug: false,
      })} `,
      {
        cwd: outputPath,
      }
    );

    await executeAsync(`npx next export `, {
      cwd: outputPath,
    });
    /*if (
      result &&
      (!Array.isArray(result) ||
        result.length === 0 ||
        (!(result[0] as string)?.startsWith("warn") &&
          !(result[0] as string)?.startsWith("- warn"))) &&
      !(result as string)?.startsWith("warn") &&
      !(result as string)?.startsWith("- warn")
    ) {
      ConsoleLogger.error(
        `An error occured building the Event Catalog website - ${result}`
      );
      return { success: false };
    }*/

    // If output path is different from source path, then copy over the config and public files.
    // This is the default behavior when running `nx build <app>`.
    /*if (
      options.outputPath.replace(/\/$/, "") !==
      context.workspace.projects[context.projectName].sourceRoot
    ) {
      createNextConfigFile(options, context);
      copyFiles(
        Path.join(
          context.workspace.projects[context.projectName].sourceRoot,
          "public"
        ),
        Path.join(outputPath, "public"),
        {
          dereference: true,
        }
      );
    }*/

    ConsoleLogger.success(
      `Event Catalog Build successfully ran for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred executing Event Catalog Build for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}

function updatePackageJson(packageJson: PackageJson, context: ExecutorContext) {
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  if (!packageJson.scripts.start) {
    packageJson.scripts.start = "next start";
  }

  packageJson.dependencies ??= {};

  // These are always required for a production Next.js app to run.
  const requiredPackages = ["react", "react-dom", "next", "typescript"];
  for (const pkg of requiredPackages) {
    const externalNode = context.projectGraph.externalNodes[`npm:${pkg}`];
    if (externalNode) {
      packageJson.dependencies[pkg] ??= externalNode.data.version;
    }
  }
}
