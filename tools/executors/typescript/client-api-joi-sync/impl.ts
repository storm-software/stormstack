import { ExecutorContext } from "@nrwl/devkit";
// import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import fs from "fs";
import openapiSchemaToCode from "./openapi-schema-to-code";
import { ClientApiJoiSyncExecutorSchema } from "./schema";

export default async function (
  options: ClientApiJoiSyncExecutorSchema,
  context: ExecutorContext
) {
  try {
    console.info("Executing client-api-joi-sync executor...");
    console.info(`Options: ${JSON.stringify(options, null, 2)}`);
    console.info(`Current Directory: ${__dirname}`);

    const { prettierConfig, specJsonFile, output } = options;

    const generatedCode = await openapiSchemaToCode(
      specJsonFile,
      prettierConfig
    );
    await fs.promises.writeFile(output, generatedCode, "utf-8");
    console.log(`File created: ${output}`);

    //console.log(generatedCode);

    //console.log(`File created: ${output}`);

    return { success: true };
  } catch (e) {
    console.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    console.error(e);

    return { success: false };
  }
}
