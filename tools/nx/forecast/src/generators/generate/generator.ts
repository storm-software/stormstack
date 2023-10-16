import { Tree, workspaceRoot } from "@nx/devkit";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { generateAction } from "@stormstack/tools-forecast-codegen/cli";
import { removeSync } from "fs-extra";
import { existsSync } from "node:fs";
import Path from "node:path";
import { ForecastGenerateGeneratorSchema } from "./schema";

export default async function (
  tree: Tree,
  options?: ForecastGenerateGeneratorSchema
) {
  try {
    ConsoleLogger.info("Running ⚡ Forecast Code Generation...");

    let schemaPath = options.schema;
    if (!existsSync(schemaPath)) {
      schemaPath = Path.join(workspaceRoot, options.schema);
      if (!existsSync(schemaPath)) {
        ConsoleLogger.error(
          `No Forecast schema file could be found. Checked:
"${options.schema}",
"${Path.join(workspaceRoot, options.schema)}" `
        );
        return { success: false };
      }
    }

    const outDir = Path.join(workspaceRoot, options.output);
    if (existsSync(outDir)) {
      removeSync(outDir);
    }

    await generateAction({
      schema: schemaPath,
      packageManager: options.packageManager,
      dependencyCheck: options.dependencyCheck,
      outDir
    });

    ConsoleLogger.success(
      `⚡ Forecast Code Generation successfully completed.`
    );
    return { success: true };
  } catch (e) {
    ConsoleLogger.error(`An error occurred executing Nx-Monorepo Release`);
    ConsoleLogger.error(e);
    return { success: false };
  }
}
