import {
  ExecutorContext,
  readProjectConfiguration,
  workspaceRoot,
} from "@nx/devkit";
import { executeAsync } from "@open-system/core-server-utilities";
import { ConsoleLogger, isSet } from "@open-system/core-shared-utilities";
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
        projectConfiguration.targets.build.options.outputPath,
        "index.js"
      )
    );
  } else if (command === "dev") {
    wranglerOptions.push(
      Path.join(workspaceRoot, projectConfiguration.targets.build.options.main)
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

  ConsoleLogger.debug(nextCommand);
  const result = await executeAsync(nextCommand, {
    cwd: projectConfiguration.root,
  });
  if (result) {
    ConsoleLogger.error(
      `An error occured executing the command '${nextCommand}'. Halting execution early.`
    );
    throw result;
  }
}
