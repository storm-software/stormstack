import type { PolicyOperationKind } from "@open-system/tools-storm-runtime";
import fs from "fs";
import path from "path";

export const ALL_OPERATION_KINDS: PolicyOperationKind[] = [
  "create",
  "update",
  "postUpdate",
  "read",
  "delete",
];

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
 * Gets the default node_modules/.zenstack output folder for plugins.
 * @returns
 */
export function getDefaultOutputFolder() {
  // Find the real runtime module path, it might be a symlink in pnpm
  let runtimeModulePath = require.resolve("@open-system/tools-storm-runtime");

  if (process.env.ZENSTACK_TEST === "1") {
    // handling the case when running as tests, resolve relative to CWD
    runtimeModulePath = path.resolve(
      path.join(process.cwd(), "node_modules", "@open-system", "runtime")
    );
  }

  if (runtimeModulePath) {
    // start with the parent folder of @zenstackhq, supposed to be a node_modules folder
    while (
      !runtimeModulePath.endsWith("@open-system") &&
      runtimeModulePath !== "/"
    ) {
      runtimeModulePath = path.join(runtimeModulePath, "..");
    }
    runtimeModulePath = path.join(runtimeModulePath, "..");
  }
  const modulesFolder = getNodeModulesFolder(runtimeModulePath);
  return modulesFolder ? path.join(modulesFolder, ".storm") : undefined;
}
