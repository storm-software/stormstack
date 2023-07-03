import { ExecutorContext } from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { runWranglerCommand } from "../utilities/wrangler";
import { CloudflareWorkerDeployExecutorSchema } from "./schema";

export default async function (
  options: CloudflareWorkerDeployExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Deploy executor...");

    const result = await runWranglerCommand(options, context, "deploy");

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
