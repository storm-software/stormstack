import { Tree } from "@nrwl/devkit";
import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import { existsSync } from "fs";
import Path from "path";
import { execute } from "../utilities";
import { ClientApiGeneratorSchema } from "./schema";

export default async function (host: Tree, options?: ClientApiGeneratorSchema) {
  try {
    ConsoleLogger.info("Executing client-api-sync executor...");
    ConsoleLogger.info(`Options: ${JSON.stringify(options, null, 2)}`);
    ConsoleLogger.info(`Current Directory: ${__dirname}`);

    const { domainName, specJsonFile, generator } = options;

    const rootPath = host.root;

    let result;
    if (
      !existsSync(
        Path.join(`${rootPath}/`, `libs/${domainName}/types/__generated__`)
      )
    ) {
      ConsoleLogger.warn(
        `The file location ${Path.join(
          `${rootPath}/`,
          `libs/${domainName}/types/__generated__`
        )} could no be found... Skipping deletes`
      );
    } else {
      ConsoleLogger.info("Clearing previously generated types.");
      result = await execute(
        `rmdir /S /Q "${Path.join(
          `${rootPath}/`,
          `libs/${domainName}/types/__generated__"`
        )}`
      );
      if (result) {
        console.error(result);
        return { success: false };
      }
      ConsoleLogger.info("Directory successfully cleared.");
    }

    ConsoleLogger.info("Syncing client API code...");

    result = await execute(
      `java -cp tools/openapi/typescript-client/target/open-system-typescript-client-openapi-generator-1.0.0.jar;tools/openapi/openapi-generator-cli-6.2.1.jar org.openapitools.codegen.OpenAPIGenerator generate --input-spec=libs/${domainName}/${
        specJsonFile ?? "api-spec.json"
      } -g ${
        generator ?? "open-system-typescript-client"
      } -o libs/${domainName} --remove-operation-id-prefix --enable-post-process-file --global-property="apiDocs=true" --additional-properties="enumNameSuffix=Types,enumPropertyNaming=UPPERCASE,supportsES6=true,npmVersion=0.0.1,libraryName=${domainName},${
        domainName?.toLowerCase() === "base" ? "isBaseLibrary=true," : ""
      }withInterfaces=true" `
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }
    ConsoleLogger.success("Client API sync succeeded.");

    if (!existsSync(Path.join(`${rootPath}/`, `libs/${domainName}/services`))) {
      ConsoleLogger.error(
        `The file location ${Path.join(
          `${rootPath}/`,
          `libs/${domainName}/services`
        )} could no be found... Something went wrong!`
      );
      return { success: false };
    }

    ConsoleLogger.info(
      "Moving service interface files over to the 'types' project"
    );
    result = await execute(
      `move "${Path.join(
        `${rootPath}/`,
        `libs/${domainName}/services/*-interface.ts`
      )}" "${Path.join(
        `${rootPath}/`,
        `libs/${domainName}/types/__generated__`
      )}"`
    );
    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }
    ConsoleLogger.success("Moved interface files successfully.");

    if (
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
    ConsoleLogger.success("Renamed index file successfully.");

    return { success: !result };
  } catch (e) {
    console.error(e);

    return { success: false };
  }
}
