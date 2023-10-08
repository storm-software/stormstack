import { ExecutorContext } from "@nx/devkit";
import { runWranglerServe } from "@stormstack/core-server-cloudflare";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { CloudflareWorkerServeExecutorSchema } from "./schema";

export default async function (
  _options: CloudflareWorkerServeExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Running ☁️ Cloudflare Worker Serve...");

    await runWranglerServe(context, {});

    ConsoleLogger.success(
      `☁️ Cloudflare Worker Serve successfully ran for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred serving the Cloudflare Worker for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
