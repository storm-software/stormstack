import { ExecutorContext, runExecutor } from "@nrwl/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { execute } from "../utilities";
import { DesignComponentsBuildExecutorSchema } from "./schema";

export default async function (
  options: DesignComponentsBuildExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing design-components-build executor...");
    ConsoleLogger.info(`Options: ${JSON.stringify(options, null, 2)}`);
    ConsoleLogger.info(`Current Directory: ${__dirname}`);

    const { baseBuildTarget, clean } = options;

    let result;
    if (clean) {
      ConsoleLogger.info("Cleaning previous design components build...");

      result = await execute(
        `rimraf dist/design-system/components/stencil/dist/collection`
      );
      if (result) {
        ConsoleLogger.error(result);
        return { success: false };
      }
    }

    ConsoleLogger.info("Starting design components build...");

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
        ConsoleLogger.error(
          `An error occurred building ${context.projectName}`
        );
        throw new Error(`An error occurred building ${context.projectName}`);
      }
    }

    ConsoleLogger.success("Build process succeeded");

    return { success: true };
  } catch (e) {
    ConsoleLogger.error(`An error occurred building ${context.projectName}`);
    ConsoleLogger.error(e);

    return { success: false };
  }
}
