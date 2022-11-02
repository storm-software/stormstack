import { ExecutorContext } from "@nrwl/devkit";
import { execute, printError, printInfo, printSuccess } from "../utilities";
import { DesignTokensCleanExecutorSchema } from "./schema";

export default async function (
  options: DesignTokensCleanExecutorSchema,
  context: ExecutorContext
) {
  try {
    printInfo("Executing design-tokens-clean executor...");
    printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    printInfo(`Current Directory: ${__dirname}`);

    const { configFile } = options;

    printInfo(`style-dictionary configuration: ${configFile}`);

    printInfo("Cleaning previous design tokens build...");

    const result = await execute(
      `style-dictionary clean --config ${configFile}`
    );
    if (result) {
      printError(result);
      return { success: false };
    }

    printSuccess("Design tokens clean succeeded.");

    return { success: !result };
  } catch (e) {
    printError(
      `An error occurred cleaning design tokens for ${context.projectName}`
    );
    printError(e);

    return { success: false };
  }
}
