import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import type { PolicyOperationKind } from "@stormstack/tools-forecast-runtime";
import fs from "node:fs";
import path from "path";

export const ALL_OPERATION_KINDS: PolicyOperationKind[] = [
  "create",
  "update",
  "postUpdate",
  "read",
  "delete"
];

const MAX_PATH_SEARCH_DEPTH = 30;
let depth = 0;

/**
 * Gets the nearest "node_modules" folder by walking up from start path.
 */
export function getNodeModulesFolder(startPath?: string): string | undefined {
  startPath = startPath ?? process.cwd();
  if (startPath.endsWith("node_modules")) {
    return startPath;
  } else if (fs.existsSync(path.join(startPath, "node_modules"))) {
    return path.join(startPath, "node_modules");
  } else if (startPath !== "/" && depth++ < MAX_PATH_SEARCH_DEPTH) {
    const parent = path.join(startPath, "..");
    return getNodeModulesFolder(parent);
  } else {
    return undefined;
  }
}

/**
 * Ensure the default output folder is initialized.
 */
export function ensureDefaultOutputFolder() {
  const output = getDefaultOutputFolder();
  if (output && !fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(
      path.join(output, "package.json"),
      JSON.stringify({ name: ".storm", version: "1.0.0" })
    );
  }
}

/**
 * Gets the default node_modules/.storm output folder for plugins.
 * @returns
 */
export function getDefaultOutputFolder() {
  depth = 0;

  let modulesFolder = process.env.FORECAST_RUNTIME_MODULE;
  if (!modulesFolder) {
    const runtimeModuleFolder = "@stormstack/tools-forecast-runtime";
    ConsoleLogger.debug(
      `Searching for Storm Runtime in ${runtimeModuleFolder}`
    );

    // Find the real runtime module path, it might be a symlink in pnpm
    let runtimeModulePath = require.resolve(runtimeModuleFolder);

    if (process.env.FORECAST_TEST === "1") {
      // handling the case when running as tests, resolve relative to CWD
      runtimeModulePath = path.resolve(
        path.join(process.cwd(), "node_modules", "@stormstack", "runtime")
      );
    }

    ConsoleLogger.debug(`Loading Storm Runtime from ${runtimeModulePath}`);

    if (runtimeModulePath) {
      // start with the parent folder of @stormstack, supposed to be a node_modules folder
      while (
        !runtimeModulePath.endsWith("@stormstack") &&
        runtimeModulePath !== "/" &&
        depth++ < MAX_PATH_SEARCH_DEPTH
      ) {
        runtimeModulePath = path.join(runtimeModulePath, "..");
      }
      runtimeModulePath = path.join(runtimeModulePath, "..");
    }
    modulesFolder = getNodeModulesFolder(runtimeModulePath);
  }

  return modulesFolder
    ? modulesFolder.endsWith(".storm")
      ? modulesFolder
      : path.join(modulesFolder, ".storm")
    : undefined;
}
