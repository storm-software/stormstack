import { Tree } from "@nx/devkit";
import { executeAsync } from "@stormstack/core-server-utilities";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
// import { ExecOptions, exec } from "child_process";
import { existsSync } from "fs";
import Path from "path";
// import { promisify } from "util";
import { ClientApiGeneratorSchema } from "./schema";

/*export const executeAsync = async (
  command: string,
  options?: ExecOptions
): Promise<string | Buffer | undefined> => {
  try {
    ConsoleLogger.info(`Executing command: "${command}"`);

    const result = await promisify(exec)(command, options);
    if (result?.stderr) {
      ConsoleLogger.error(`An error occurred executing command: "${command}"`);
      ConsoleLogger.error(result.stderr);

      return result.stderr;
    }

    return undefined;
  } catch (e) {
    ConsoleLogger.error(`An error occurred executing command: "${command}"`);
    ConsoleLogger.error(e);

    return (
      (e as any)?.message ?? "Exception occurred while processing request "
    );
  }
};*/

export default async function (host: Tree, options?: ClientApiGeneratorSchema) {
  try {
    ConsoleLogger.info("Executing client-api executor...");
    ConsoleLogger.info(`Options: ${JSON.stringify(options, null, 2)}`);
    ConsoleLogger.info(`Current Directory: ${__dirname}`);

    const { domainName, specJsonFile, generator, projectName } = options;

    const rootPath = host.root;
    const sourceRoot =
      options.sourceRoot.lastIndexOf("/src") > 0
        ? options.sourceRoot.substring(
            0,
            options.sourceRoot.lastIndexOf("/src")
          )
        : options.sourceRoot;
    if (!sourceRoot || sourceRoot.length <= 1) {
      ConsoleLogger.error(`No sourceRoot could be found: "${sourceRoot}" `);
      return { success: false };
    }

    ConsoleLogger.info("Syncing client API code...");

    const result = await executeAsync(
      `java -cp tools/openapi/typescript-client/target/open-system-typescript-client-openapi-generator-1.0.0.jar;tools/openapi/openapi-generator-cli-6.2.1.jar org.openapitools.codegen.OpenAPIGenerator generate --input-spec=${specJsonFile} -g ${
        generator ?? "open-system-typescript-client"
      } -o ${sourceRoot} --remove-operation-id-prefix --enable-post-process-file --global-property="apiDocs=true" --additional-properties="enumNameSuffix=Types,enumPropertyNaming=UPPERCASE,supportsES6=true,libraryName=${projectName},${
        domainName?.toLowerCase() === "core" ? "isBaseLibrary=true," : ""
      }withInterfaces=true,useInversify=true,useObjectParameters=true,useRxJS=false,npmName=@stormstack/${projectName},npmVersion=0.0.1,gitHost=github.com,gitUserId=sullivanpj,gitRepoId=open-system,projectName=${projectName},sourceRoot=${sourceRoot},specJsonFile=${specJsonFile},domainName=${domainName},modelNameSuffix=Dto" `
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }
    ConsoleLogger.success("Client API sync succeeded.");

    if (!existsSync(Path.join(`${rootPath}/`, sourceRoot))) {
      ConsoleLogger.error(
        `The file location ${Path.join(
          `${rootPath}/`,
          sourceRoot
        )} could no be found... Something went wrong!`
      );
      return { success: false };
    }

    return { success: !result };
  } catch (e) {
    console.error(e);

    return { success: false };
  }
}
