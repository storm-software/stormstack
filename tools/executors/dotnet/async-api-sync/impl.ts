import Generator from "@asyncapi/generator";
import { ExecutorContext } from "@nrwl/devkit";
import { printError, printInfo, printSuccess } from "../utilities";
import { AsyncApiSyncExecutorSchema } from "./schema";

export default async function (
  {
    asyncapiFileDir,
    templateName,
    targetDir,
    ...options
  }: AsyncApiSyncExecutorSchema,
  context: ExecutorContext
) {
  printInfo("Syncing async API code");

  try {
    const generator = new Generator(templateName, targetDir, {
      templateParams: { ...options },
      forceWrite: true,
      debug: true,
    });

    printInfo(
      `Generator has been created, preparing to generate from file: ${asyncapiFileDir}`
    );

    try {
      await generator.generateFromFile(asyncapiFileDir);
    } catch (e) {
      printError(`An error occurred building`);
      throw e;
    }

    printSuccess("Async API code generation process succeeded");

    return { success: true };
  } catch (e) {
    printError(`An error occurred building ${context.projectName}`);
    printError(e);

    return { success: false };
  }
}
