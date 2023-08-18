import Generator from "@asyncapi/generator";
import { ExecutorContext } from "@nx/devkit";
import { executeAsync } from "@open-system/core-server-utilities/execute-async";
import { ConsoleLogger } from "@open-system/core-shared-utilities";
import { existsSync } from "fs-extra";
import glob from "glob";
import Path from "path";
import { EventLibraryExecutorSchema } from "./schema";
import { mapTemplateToImport } from "./utilities";

export default async function (
  { templateName }: EventLibraryExecutorSchema,
  context: ExecutorContext
) {
  ConsoleLogger.info("Running Event Library code executor.");

  try {
    const libsDirectory = Path.join(
      context.root,
      "libs",
      "**",
      "config",
      "**",
      "*(*.async-api.json|*.async-api.yaml)"
    );
    const files = glob.sync(libsDirectory);

    if (!files || files.length === 0) {
      ConsoleLogger.error(
        `No Async-API specs could be found in library packages. Searched in directory: '${libsDirectory}'. ** NOTE: Async-API specs must be named with the extension '.async-api.json' **`
      );
      return { success: false };
    }

    const outputPath = Path.join(
      context.root,
      context.workspace.projects[context.projectName].sourceRoot
    );

    for (const file of files) {
      ConsoleLogger.info(
        `Generating events from Async-API spec in file: ${file}`
      );

      const domainName = file.substring(
        Path.join(context.root, "libs").length + 1,
        file.indexOf("/", Path.join(context.root, "libs").length + 2)
      );
      const domainOutputPath = Path.join(outputPath, domainName);
      ConsoleLogger.info(
        `Determined domain to be '${domainName}' - '${domainOutputPath}'`
      );

      if (existsSync(domainOutputPath)) {
        const result = await executeAsync(`rmdir /S /Q "${domainOutputPath}" `);
        if (result) {
          ConsoleLogger.error(result);
          return { success: false };
        }
      } else {
        const result = await executeAsync(`mkdir ${domainOutputPath}`);
        if (SpeechRecognitionResult) {
          ConsoleLogger.error(result);
          return { success: false };
        }
      }

      const generator = new Generator(
        Path.join(context.root, mapTemplateToImport(templateName)),
        domainOutputPath,
        {
          templateParams: {
            outputPath: domainOutputPath,
          },
          forceWrite: true,
        }
      );

      ConsoleLogger.info(
        `Generator has been created, preparing to generate from file: ${file}`
      );

      try {
        await generator.generateFromFile(file);
      } catch (e) {
        ConsoleLogger.error(`An error occurred building`);
        throw e;
      }
    }

    ConsoleLogger.info("Event Library code generation process succeeded");

    return { success: true };
  } catch (e) {
    ConsoleLogger.error(`An error occurred building ${context.projectName}`);
    ConsoleLogger.error(e);

    return { success: false };
  }
}
