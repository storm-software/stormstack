import { ExecutorContext } from "@nrwl/devkit";
import { execute, printError, printInfo, printSuccess } from "../utilities";
import { DesignComponentsCleanExecutorSchema } from "./schema";

export default async function (
  options: DesignComponentsCleanExecutorSchema,
  context: ExecutorContext
) {
  try {
    printInfo("Executing design-components-clean executor...");
    printInfo(`Current Directory: ${__dirname}`);

    printInfo("Cleaning previous design components build...");

    const result = await execute(
      `rimraf dist/design-system/components/!("package.json")`
    );
    if (result) {
      printError(result);
      return { success: false };
    }

    printSuccess("Clean process succeeded");

    return { success: true };
  } catch (e) {
    printError(`An error occurred cleaning ${context.projectName}`);
    printError(e);

    return { success: false };
  }
}
