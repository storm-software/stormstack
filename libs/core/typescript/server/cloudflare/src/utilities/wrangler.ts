/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExecutorContext,
  readProjectConfiguration,
  workspaceRoot
} from "@nx/devkit";
import { executeAsync } from "@open-system/core-server-utilities/execute";
import { ConfigurationError } from "@open-system/core-shared-utilities";
import { isSet } from "@open-system/core-shared-utilities/common/type-checks";
import { ConsoleLogger } from "@open-system/core-shared-utilities/logging";
import { FsTree } from "nx/src/generators/tree";
import Path from "path";

export async function runWranglerCommand(
  options: Record<string, string | boolean | number>,
  context: ExecutorContext,
  command: "dev" | "deploy"
) {
  const { projectName } = context;

  if (!projectName) {
    ConsoleLogger.error("No project name was provided in context object.");
    throw new ConfigurationError("projectName");
  }

  const tree = new FsTree(process.cwd(), false);
  const projectConfiguration = readProjectConfiguration(tree, projectName);
  const configuration = projectConfiguration?.targets?.["build"]?.options ?? {};

  const wranglerOptions = [];
  if (command === "deploy") {
    wranglerOptions.push(
      Path.join(workspaceRoot, configuration.outputPath, "worker.mjs")
    );
  } else if (command === "dev") {
    wranglerOptions.push(Path.join(workspaceRoot, configuration.main));
  }

  const nextCommand = `NO_D1_WARNING=true npx wrangler ${command} ${wranglerOptions.join(
    " "
  )} ${Object.entries(options).reduce(
    (ret: string, [key, value]: [string, string | number | boolean]) => {
      if (isSet(key) && isSet(value)) {
        ret += ` --${key}=${value} `;
      }

      return ret;
    },
    ""
  )} `;

  try {
    ConsoleLogger.debug(nextCommand);
    await executeAsync(nextCommand);
  } catch (e) {
    ConsoleLogger.error(
      `An error occured executing the command '${nextCommand}'. Halting execution early.`
    );
    console.error(e);
  }
}
