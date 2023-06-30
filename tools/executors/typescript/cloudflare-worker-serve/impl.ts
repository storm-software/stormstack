import { ExecutorContext } from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { runWranglerCommand } from "../utilities/wrangler";
import { CloudflareWorkerServeExecutorSchema } from "./schema";

export default async function (
  options: CloudflareWorkerServeExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Serve executor...");

    const result = await runWranglerCommand(options, context, "dev");
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }

    ConsoleLogger.success(
      `Cloudflare Worker server successfully ran for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    console.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    console.error(e);

    return { success: false };
  }
}
