import { ExecutorContext } from "@nx/devkit";
import { runWranglerDeploy } from "@stormstack/core-server-cloudflare/utilities/wrangler-deploy";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { CloudflareWorkerDeployExecutorSchema } from "./schema";

export default async function (
  options: CloudflareWorkerDeployExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Deploy executor...");

    await runWranglerDeploy(context, {});

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
