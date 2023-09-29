import { ExecutorContext, workspaceRoot } from "@nx/devkit";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { generateAction } from "@stormstack/tools-forecast-codegen";
import { existsSync } from "fs";
import { removeSync } from "fs-extra";
import Path from "path";
import { ForecastGenerateExecutorSchema } from "./schema";

Error.stackTraceLimit = Infinity;

export default async function (
  options: ForecastGenerateExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Running ⚡ Forecast Code Generation...");

    const buildTarget =
      context.workspace.projects[context.projectName].targets.build;
    const projectRoot = context.workspace.projects[context.projectName].root;
    const sourceRoot =
      context.workspace.projects[context.projectName].sourceRoot;

    let schemaPath = options.schema;
    if (!existsSync(schemaPath)) {
      schemaPath = Path.join(workspaceRoot, options.schema);
      if (!existsSync(schemaPath)) {
        schemaPath = Path.join(projectRoot, options.schema);
        if (!existsSync(schemaPath)) {
          schemaPath = Path.join(sourceRoot, options.schema);
          if (!existsSync(schemaPath)) {
            ConsoleLogger.error(
              `No Forecast schema file could be found. Checked:
"${options.schema}",
"${Path.join(workspaceRoot, options.schema)}",
"${Path.join(projectRoot, options.schema)}",
"${schemaPath}" `
            );
            return { success: false };
          }
        }
      }
    }

    const outputPath = Path.join(workspaceRoot, buildTarget.options.outputPath);
    if (existsSync(outputPath)) {
      removeSync(outputPath);
    }

    await generateAction({
      schema: schemaPath,
      packageManager: options.packageManager,
      dependencyCheck: options.dependencyCheck,
      outDir: outputPath
    });

    ConsoleLogger.success(
      `⚡ Forecast Code Generation successfully completed.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred running Forecast (Code Generation) executor for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
