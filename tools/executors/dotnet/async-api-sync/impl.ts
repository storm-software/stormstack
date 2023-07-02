import Generator from "@asyncapi/generator";
import { ExecutorContext } from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
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
  ConsoleLogger.info("Syncing async API code");

  try {
    const generator = new Generator(templateName, targetDir, {
      templateParams: { ...options },
      forceWrite: true,
      debug: true,
    });

    ConsoleLogger.info(
      `Generator has been created, preparing to generate from file: ${asyncapiFileDir}`
    );

    try {
      await generator.generateFromFile(asyncapiFileDir);
    } catch (e) {
      ConsoleLogger.error(`An error occurred building`);
      throw e;
    }

    ConsoleLogger.success("Async API code generation process succeeded");

    return { success: true };
  } catch (e) {
    ConsoleLogger.error(`An error occurred building ${context.projectName}`);
    ConsoleLogger.error(e);

    return { success: false };
  }
}
