import { ExecutorContext } from "@nrwl/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { execute } from "../utilities";
import { DesignTokensCleanExecutorSchema } from "./schema";

export default async function (
  options: DesignTokensCleanExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing design-tokens-clean executor...");
    ConsoleLogger.info(`Options: ${JSON.stringify(options, null, 2)}`);
    ConsoleLogger.info(`Current Directory: ${__dirname}`);

    const { configFile } = options;

    ConsoleLogger.info(`style-dictionary configuration: ${configFile}`);

    ConsoleLogger.info("Cleaning previous design tokens build...");

    const result = await execute(
      `style-dictionary clean --config ${configFile}`
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }

    ConsoleLogger.success("Design tokens clean succeeded.");

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred cleaning design tokens for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
