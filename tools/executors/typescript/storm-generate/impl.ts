import { ExecutorContext, workspaceRoot } from "@nx/devkit";
import { executeAsync } from "@open-system/core-server-utilities";
import { ConsoleLogger } from "@open-system/core-shared-utilities";
import { generateAction } from "@open-system/tools-storm-schema";
import { existsSync } from "fs";
import Path from "path";
import { StormGenerateExecutorSchema } from "./schema";

export default async function (
  options: StormGenerateExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Executing Storm (Code Generation) executor...");

    const buildTarget =
      context.workspace.projects[context.projectName].targets.build;

    const schemaPath = Path.join(workspaceRoot, options.schema);
    if (!existsSync(schemaPath)) {
      ConsoleLogger.error(
        `No Storm schema file could be found at: "${schemaPath}" `
      );
      return { success: false };
    }

    const outputPath = Path.join(workspaceRoot, buildTarget.options.outputPath);
    if (existsSync(outputPath)) {
      result = await executeAsync(`rmdir /S /Q "${outputPath}" `);
      if (result) {
        ConsoleLogger.error(result);
        return { success: false };
      }
    }

    await generateAction({
      schema: schemaPath,
      packageManager: options.packageManager,
      dependencyCheck: options.dependencyCheck,
      outDir: outputPath,
    });

    ConsoleLogger.success(
      `Storm (Code Generation) executor successfully ran for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
