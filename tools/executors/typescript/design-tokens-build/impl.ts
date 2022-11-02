import { ExecutorContext } from "@nrwl/devkit";
import { execute, printError, printInfo, printSuccess } from "../utilities";
import { DesignTokensBuildExecutorSchema } from "./schema";

export default async function (
  options: DesignTokensBuildExecutorSchema,
  context: ExecutorContext
) {
  try {
    printInfo("Executing design-tokens-build executor...");
    printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    printInfo(`Current Directory: ${__dirname}`);

    const { configFile, clean } = options;

    printInfo(`style-dictionary configuration: ${configFile}`);

    printInfo("Starting design tokens build...");

    let result;
    if (clean) {
      printInfo("Cleaning previous design tokens build...");

      result = await execute(`style-dictionary clean --config ${configFile}`);
      if (result) {
        printError(result);
        return { success: false };
      }
    }

    printInfo("Building latest design tokens...");

    result = await execute(`style-dictionary build --config ${configFile}`);
    if (result) {
      printError(result);
      return { success: false };
    }

    printSuccess("Design tokens sync succeeded.");

    return { success: !result };
  } catch (e) {
    printError(
      `An error occurred syncing client API for ${context.projectName}`
    );
    printError(e);

    return { success: false };
  }
}
