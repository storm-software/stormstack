import Generator from "@asyncapi/generator";
import { Tree } from "@nrwl/devkit";
import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import { AsyncApiGeneratorSchema } from "./schema";

export default async function (
  host: Tree,
  {
    asyncapiFileDir,
    templateName,
    targetDir,
    ...options
  }: AsyncApiGeneratorSchema
) {
  ConsoleLogger.info(`Generating async API code to ${targetDir}`);

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
    ConsoleLogger.error(e);

    return { success: false };
  }
}
