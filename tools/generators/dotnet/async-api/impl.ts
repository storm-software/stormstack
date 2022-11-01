import Generator from "@asyncapi/generator";
import { Tree } from "@nrwl/devkit";
import { printError, printInfo, printSuccess } from "../utilities";
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
  printInfo(`Generating async API code to ${targetDir}`);

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
    printError(e);

    return { success: false };
  }
}
