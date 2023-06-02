import { ExecutorContext } from "@nrwl/devkit";
// import { ConsoleLogger } from "@open-system/core-utilities";
import { existsSync } from "fs";
import Path from "path";
import { execute } from "../utilities";
import { ClientApiSyncExecutorSchema } from "./schema";

export default async function (
  options: ClientApiSyncExecutorSchema,
  context: ExecutorContext
) {
  try {
    console.info("Executing client-api-sync executor...");
    console.info(`Options: ${JSON.stringify(options, null, 2)}`);
    console.info(`Current Directory: ${__dirname}`);

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
      console.error(`No sourceRoot could be found: "${sourceRoot}" `);
      return { success: false };
    }

    let result;
    if (!existsSync(Path.join(`${rootPath}/`, sourceRoot))) {
      console.warn(
        `The file location ${Path.join(
          `${rootPath}/`,
          sourceRoot
        )} could no be found... Skipping deletes`
      );
    } else {
      console.info("Clearing previously generated types.");
      result = await execute(
        `rmdir /S /Q "${Path.join(`${rootPath}/`, sourceRoot)}" `
      );
      if (result) {
        console.error(result);
        return { success: false };
      }
      console.info("Directory successfully cleared.");
    }

    console.info("Syncing client API code...");

    result = await execute(
      `java -cp tools/openapi/typescript-client/target/open-system-typescript-client-openapi-generator-1.0.0.jar;tools/openapi/openapi-generator-cli-6.2.1.jar org.openapitools.codegen.OpenAPIGenerator generate --input-spec=${specJsonFile} -g ${
        generator ?? "open-system-typescript-client"
      } -o ${sourceRoot} --remove-operation-id-prefix --enable-post-process-file --global-property="apiDocs=true" --additional-properties="enumNameSuffix=Types,enumPropertyNaming=UPPERCASE,supportsES6=true,libraryName=${projectName},${
        domainName?.toLowerCase() === "core" ? "isBaseLibrary=true," : ""
      }withInterfaces=true,useInversify=true,useObjectParameters=true,useRxJS=false,npmName=@open-system/${projectName},npmVersion=0.0.1,gitHost=github.com,gitUserId=sullivanpj,gitRepoId=open-system,projectName=${projectName},sourceRoot=${sourceRoot},specJsonFile=${specJsonFile},domainName=${domainName}" `
    );
    if (result) {
      console.error(result);
      return { success: false };
    }
    console.info("Client API sync succeeded.");

    /*if (!existsSync(Path.join(`${rootPath}/`, `libs/${domainName}/services`))) {
      ConsoleLogger.error(
        `The file location ${Path.join(
          `${rootPath}/`,
          `libs/${domainName}/services`
        )} could no be found... Something went wrong!`
      );
      return { success: false };
    }*/

    console.info("Moving parser service files over to the 'service' folder...");
    result = await execute(
      `move "${Path.join(
        rootPath,
        sourceRoot,
        "src",
        "parsers",
        `/*.service.ts`
      )}" "${Path.join(`${rootPath}/`, sourceRoot, "src", "services")}"`
    );
    if (result) {
      console.error(result);
      return { success: false };
    }
    console.info("Moved parser service files successfully.");

    /*if (
      !existsSync(
        Path.join(
          `${rootPath}/`,
          `libs/${domainName}/types/__generated__/models.ts`
        )
      )
    ) {
      ConsoleLogger.error(
        `The file location ${Path.join(
          `${rootPath}/`,
          `libs/${domainName}/__generated__/models.ts`
        )} could no be found... Something went wrong!`
      );
      return { success: false };
    }

    ConsoleLogger.info('Renaming index file in "__generated__" folder');
    result = await execute(
      `ren "${Path.join(
        `${rootPath}/`,
        `libs/${domainName}/types/__generated__/models.ts`
      )}" "index.ts"`
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }
    ConsoleLogger.success("Renamed index file successfully.");*/

    return { success: !result };
  } catch (e) {
    console.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    console.error(e);

    return { success: false };
  }
}
