import { ExecutorContext } from "@nx/devkit";
import { ConsoleLogger, formatDate } from "@open-system/core-utilities";
import { runWranglerCommand } from "../utilities/wrangler";
import { CloudflareWorkerDeployExecutorSchema } from "./schema";

export default async function (
  options: CloudflareWorkerDeployExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Deploy executor...");
    ConsoleLogger.info(formatDate());

    await runWranglerCommand(
      { "compatibility-date": formatDate() },
      context,
      "deploy"
    );

    ConsoleLogger.success(
      `Cloudflare Worker server successfully ran for ${context.projectName}.`
    );

    return { success: true };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    console.error(e);

    return { success: false };
  }
}
