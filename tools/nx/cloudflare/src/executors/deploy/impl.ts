import { ExecutorContext } from "@nx/devkit";
import { runWranglerServe } from "@stormstack/core-server-cloudflare";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { CloudflareWorkerDeployExecutorSchema } from "./schema";

export default async function (
  _options: CloudflareWorkerDeployExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Running ☁️ Cloudflare Worker Deploy...");

    await runWranglerServe(context, {});

    ConsoleLogger.success(
      `☁️ Cloudflare Worker Deploy successfully ran for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred deploying the Cloudflare Worker for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
