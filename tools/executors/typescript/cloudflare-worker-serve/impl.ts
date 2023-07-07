import { ExecutorContext } from "@nx/devkit";
import { runWranglerCommand } from "@open-system/core-server-cloudflare";
import { ConsoleLogger } from "@open-system/core-shared-utilities";
import { CloudflareWorkerServeExecutorSchema } from "./schema";

export default async function (
  options: CloudflareWorkerServeExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Serve executor...");

    await runWranglerCommand(options, context, "dev");

    ConsoleLogger.success(
      `Cloudflare Worker server successfully ran for ${context.projectName}.`
    );

    return { success: true };
  } catch (e) {
    console.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    console.error(e);

    return { success: false };
  }
}
