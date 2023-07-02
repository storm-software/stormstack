import {
  ExecutorContext,
  joinPathFragments,
  readProjectConfiguration,
  workspaceRoot,
} from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { executeAsync } from "@open-system/core-utilities/server-utilities/command-prompt-fns";
import { FsTree } from "nx/src/generators/tree";

export async function runWranglerCommand(
  _: unknown,
  context: ExecutorContext,
  command: "dev" | "publish"
) {
  try {
    const { projectName } = context;

    const tree = new FsTree(process.cwd(), false);
    const projectConfiguration = readProjectConfiguration(tree, projectName);

    const wranglerOptions = [];

    if (command === "publish") {
      wranglerOptions.push(
        joinPathFragments(
          workspaceRoot,
          projectConfiguration.targets.build.options.outputPath,
          "index.js"
        )
      );
    } else if (command === "dev") {
      wranglerOptions.push(
        joinPathFragments(
          workspaceRoot,
          projectConfiguration.targets.build.options.main
        )
      );
    }

    const nextCommand = `npx wrangler ${command} ${wranglerOptions.join(" ")}`;

    ConsoleLogger.debug(nextCommand);
    const result = await executeAsync(nextCommand, {
      cwd: projectConfiguration.root,
    });
    if (result) {
      ConsoleLogger.error(
        `An error occured executing the command '${nextCommand}'. Halting execution early.`
      );
      return result;
    }
  } catch (e) {
    ConsoleLogger.error(e);
    return e;
  }
}
