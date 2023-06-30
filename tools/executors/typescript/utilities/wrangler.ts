import {
  ExecutorContext,
  joinPathFragments,
  readProjectConfiguration,
  workspaceRoot,
} from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { FsTree } from "nx/src/generators/tree";
import { execute } from "./helper-utilities";

export async function runWranglerCommand(
  _: unknown,
  context: ExecutorContext,
  command: "dev" | "publish" | "pages publish" | "pages dev"
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

    ConsoleLogger.debug(`npx wrangler ${command} ${wranglerOptions.join(" ")}`);
    await execute(`npx wrangler ${command} ${wranglerOptions.join(" ")}`, {
      cwd: projectConfiguration.root,
    });
  } catch (e) {
    return e;
  }
}
