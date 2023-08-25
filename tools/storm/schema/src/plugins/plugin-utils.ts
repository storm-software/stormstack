import { ConsoleLogger } from "@open-system/core-shared-utilities/logging/console-logger";
import type { PolicyOperationKind } from "@open-system/tools-storm-runtime";
import fs from "fs";
import path from "path";

export const ALL_OPERATION_KINDS: PolicyOperationKind[] = [
  "create",
  "update",
  "postUpdate",
  "read",
  "delete"
];

const MAX_PATH_SEARCH_DEPTH = 30;

/**
 * Gets the nearest "node_modules" folder by walking up from start path.
 */
export function getNodeModulesFolder(startPath?: string): string | undefined {
  startPath = startPath ?? process.cwd();
  if (startPath.endsWith("node_modules")) {
    return startPath;
  } else if (fs.existsSync(path.join(startPath, "node_modules"))) {
    return path.join(startPath, "node_modules");
  } else if (startPath !== "/") {
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
  let modulesFolder = process.env.STORM_RUNTIME_MODULE;
  if (!modulesFolder) {
    const runtimeModuleFolder = "@open-system/tools-storm-runtime";
    ConsoleLogger.debug(
      `Searching for Storm Runtime in ${runtimeModuleFolder}`
    );

    // Find the real runtime module path, it might be a symlink in pnpm
    let runtimeModulePath = require.resolve(runtimeModuleFolder);

    if (process.env.STORM_TEST === "1") {
      // handling the case when running as tests, resolve relative to CWD
      runtimeModulePath = path.resolve(
        path.join(process.cwd(), "node_modules", "@open-system", "runtime")
      );
    }

    ConsoleLogger.debug(`Loading Storm Runtime from ${runtimeModulePath}`);

    if (runtimeModulePath) {
      // start with the parent folder of @open-system, supposed to be a node_modules folder
      let depth = 0;
      while (
        !runtimeModulePath.endsWith("@open-system") &&
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
