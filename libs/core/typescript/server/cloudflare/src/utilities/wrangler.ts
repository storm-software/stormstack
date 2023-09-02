import {
  ExecutorContext,
  readProjectConfiguration,
  workspaceRoot
} from "@nx/devkit";
import { executeAsync } from "@open-system/core-server-utilities/execute";
import { isSet } from "@open-system/core-shared-utilities/common/type-checks";
import { ConsoleLogger } from "@open-system/core-shared-utilities/logging";
import { FsTree } from "nx/src/generators/tree";
import Path from "path";

export async function runWranglerCommand(
  options: unknown,
  context: ExecutorContext,
  command: "dev" | "deploy"
) {
  const { projectName } = context;

  const tree = new FsTree(process.cwd(), false);
  const projectConfiguration = readProjectConfiguration(tree, projectName);

  const wranglerOptions = [];
  if (command === "deploy") {
    wranglerOptions.push(
      Path.join(
        workspaceRoot,
        projectConfiguration.targets["build"].options.outputPath,
        "worker.mjs"
      )
    );
  } else if (command === "dev") {
    wranglerOptions.push(
      Path.join(
        workspaceRoot,
        projectConfiguration.targets["build"].options.main
      )
    );
  }

  const nextCommand = `npx wrangler ${command} ${wranglerOptions.join(
    " "
  )} ${Object.entries(options).reduce(
    (ret: string, [key, value]: [string, string]) => {
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
