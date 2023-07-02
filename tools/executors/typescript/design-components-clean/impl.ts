import { ExecutorContext } from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { executeAsync } from "@open-system/core-utilities/server-utilities/command-prompt-fns";
import { DesignComponentsCleanExecutorSchema } from "./schema";

export default async function (
  options: DesignComponentsCleanExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing design-components-clean executor...");
    ConsoleLogger.info(`Current Directory: ${__dirname}`);

    ConsoleLogger.info("Cleaning previous design components build...");

    const result = await executeAsync(
      `rimraf dist/design-system/components/stencil/dist/collection`
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }

    ConsoleLogger.success("Clean process succeeded");

    return { success: true };
  } catch (e) {
    ConsoleLogger.error(`An error occurred cleaning ${context.projectName}`);
    ConsoleLogger.error(e);

    return { success: false };
  }
}
