import { ExecutorContext } from "@nx/devkit";
import { executeAsync } from "@open-system/core-server-utilities";
import { ConsoleLogger } from "@open-system/core-shared-utilities";
import { existsSync } from "fs";
import Path from "path";
import { ClientApiSyncExecutorSchema } from "./schema";

export default async function (
  options: ClientApiSyncExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Executing client-api-sync executor...");
    ConsoleLogger.info(`Options: ${JSON.stringify(options, null, 2)}`);
    ConsoleLogger.info(`Current Directory: ${__dirname}`);

    const { domainName, specJsonFile, generator } = options;

    const rootPath = context.root;
    const projectName = context.projectName
      ? context.projectName
      : `${domainName}-data-access`;

    let sourceRoot =
      context.projectName && context.workspace.projects
        ? context.workspace.projects[context.projectName].sourceRoot
        : `libs/${domainName}/typescript/data-access`;
    sourceRoot =
      sourceRoot.lastIndexOf("/src") > 0
        ? sourceRoot.substring(0, sourceRoot.lastIndexOf("/src"))
        : sourceRoot;
    if (!sourceRoot || sourceRoot.length <= 1) {
      ConsoleLogger.error(`No sourceRoot could be found: "${sourceRoot}" `);
      return { success: false };
    }

    let result;
    if (!existsSync(Path.join(`${rootPath}/`, sourceRoot))) {
      ConsoleLogger.warn(
        `The file location ${Path.join(
          `${rootPath}/`,
          sourceRoot
        )} could no be found... Skipping deletes`
      );
    } else {
      ConsoleLogger.info("Clearing previously generated types.");
      result = await executeAsync(
        `rmdir /S /Q "${Path.join(`${rootPath}/`, sourceRoot)}" `
      );
      if (result) {
        ConsoleLogger.error(result);
        return { success: false };
      }
      ConsoleLogger.info("Directory successfully cleared.");
    }

    ConsoleLogger.info("Syncing client API code...");

    result = await executeAsync(
      `java -cp tools/openapi/typescript-client/target/open-system-typescript-client-openapi-generator-1.0.0.jar;tools/openapi/openapi-generator-cli-6.2.1.jar org.openapitools.codegen.OpenAPIGenerator generate --input-spec=${specJsonFile} -g ${
        generator ?? "open-system-typescript-client"
      } -o ${sourceRoot} --remove-operation-id-prefix --enable-post-process-file --global-property="apiDocs=true" --additional-properties="enumNameSuffix=Types,enumPropertyNaming=UPPERCASE,supportsES6=true,libraryName=${projectName},${
        domainName?.toLowerCase() === "core" ? "isBaseLibrary=true," : ""
      }withInterfaces=true,useInversify=true,useObjectParameters=true,useRxJS=false,npmName=@open-system/${projectName},npmVersion=0.0.1,gitHost=github.com,gitUserId=sullivanpj,gitRepoId=open-system,projectName=${projectName},sourceRoot=${sourceRoot},specJsonFile=${specJsonFile},domainName=${domainName}" `
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }
    ConsoleLogger.info("Client API sync succeeded.");

    ConsoleLogger.info(
      "Moving parser service files over to the 'service' folder..."
    );
    result = await executeAsync(
      `move "${Path.join(
        rootPath,
        sourceRoot,
        "src",
        "parsers",
        `/*.service.ts`
      )}" "${Path.join(`${rootPath}/`, sourceRoot, "src", "services")}"`
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }
    ConsoleLogger.info("Moved parser service files successfully.");

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
