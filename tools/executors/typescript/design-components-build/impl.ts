import { ExecutorContext, runExecutor } from "@nrwl/devkit";
import { execute, printError, printInfo, printSuccess } from "../utilities";
import { DesignComponentsBuildExecutorSchema } from "./schema";

export default async function (
  options: DesignComponentsBuildExecutorSchema,
  context: ExecutorContext
) {
  try {
    printInfo("Executing design-components-build executor...");
    printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    printInfo(`Current Directory: ${__dirname}`);

    const { baseBuildTarget, clean } = options;

    let result;
    if (clean) {
      printInfo("Cleaning previous design components build...");

      result = await execute(
        `attrib +r "dist/design-system/components/package.json"`
      );
      if (result) {
        printError(result);
        return { success: false };
      }

      result = await execute(`del "dist/design-system/components"`);
      if (result) {
        printError(result);
        return { success: false };
      }

      result = await execute(
        `attrib -r "dist/design-system/components/package.json"`
      );
      if (result) {
        printError(result);
        return { success: false };
      }
    }

    printInfo("Starting design components build...");

    for await (const output of await runExecutor(
      {
        project: context.projectName,
        target: baseBuildTarget,
        configuration: "build",
      },
      {
        ...options,
        clean: undefined,
        baseBuildTarget: undefined,
      },
      context
    )) {
      if (!output.success) {
        printError(`An error occurred building ${context.projectName}`);
        throw new Error(`An error occurred building ${context.projectName}`);
      }
    }

    printSuccess("Build process succeeded");

    return { success: true };
  } catch (e) {
    printError(`An error occurred building ${context.projectName}`);
    printError(e);

    return { success: false };
  }
}
