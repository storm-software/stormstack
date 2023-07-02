import { ExecutorContext, joinPathFragments, workspaceRoot } from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { executeAsync } from "../utilities/command-prompt-fns";
import { CloudflareWorkerBuildExecutorSchema } from "./schema";

export default async function (
  options: CloudflareWorkerBuildExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Build executor...");

    const buildTarget =
      context.workspace.projects[context.projectName].targets.build;
    const outputPath = joinPathFragments(
      workspaceRoot,
      buildTarget.options.outputPath
    );
    const entryFile = joinPathFragments(
      workspaceRoot,
      buildTarget.options.main
    );

    let result = await executeAsync(`rm -rf ${outputPath} || true`);
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }

    result = await executeAsync(`mkdir -p ${outputPath}`);
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }

    result = await executeAsync(
      `esbuild --bundle --outdir=${outputPath} ${entryFile} `
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }

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
