import { ExecutorContext, workspaceRoot } from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { existsSync } from "fs";
import Path from "path";
import { executeAsync } from "../utilities/command-prompt-fns";
import { CloudflareWorkerBuildExecutorSchema } from "./schema";

export default async function (
  options: CloudflareWorkerBuildExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Build executor...");

    const buildTarget =
      context.workspace.projects[context.projectName].targets.build;

    const outputPath = Path.join(workspaceRoot, buildTarget.options.outputPath);
    const mainPath = Path.join(workspaceRoot, buildTarget.options.main);
    if (existsSync(outputPath)) {
      result = await executeAsync(`rmdir /S /Q "${outputPath}" `);
      if (result) {
        ConsoleLogger.error(result);
        return { success: false };
      }
    }

    /*if (!existsSync(outputPath)) {
      result = await executeAsync(`mkdir -p ${outputPath}`);
      if (result) {
        ConsoleLogger.error(result);
        return { success: false };
      }
    }*/

    await executeAsync(`esbuild --bundle --outdir=${outputPath} ${mainPath} `);

    ConsoleLogger.success(
      `Cloudflare Worker build successfully ran for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
