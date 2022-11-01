import { Tree } from "@nrwl/devkit";
import { existsSync } from "fs";
import Path from "path";
import {
  execute,
  printError,
  printInfo,
  printSuccess,
  printWarning,
} from "../utilities";
import { ClientApiGeneratorSchema } from "./schema";

export default async function (host: Tree, options?: ClientApiGeneratorSchema) {
  try {
    printInfo("Executing client-api-sync executor...");
    printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    printInfo(`Current Directory: ${__dirname}`);

    const { domainName, specJsonFile, generator } = options;

    const rootPath = host.root;

    let result;
    if (
      !existsSync(
        Path.join(`${rootPath}/`, `libs/${domainName}/types/__generated__`)
      )
    ) {
      printWarning(
        `The file location ${Path.join(
          `${rootPath}/`,
          `libs/${domainName}/types/__generated__`
        )} could no be found... Skipping deletes`
      );
    } else {
      printInfo("Clearing previously generated types.");
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
      printInfo("Directory successfully cleared.");
    }

    printInfo("Syncing client API code...");

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
      printError(result);
      return { success: false };
    }
    printSuccess("Client API sync succeeded.");

    if (!existsSync(Path.join(`${rootPath}/`, `libs/${domainName}/services`))) {
      printError(
        `The file location ${Path.join(
          `${rootPath}/`,
          `libs/${domainName}/services`
        )} could no be found... Something went wrong!`
      );
      return { success: false };
    }

    printInfo("Moving service interface files over to the 'types' project");
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
      printError(result);
      return { success: false };
    }
    printSuccess("Moved interface files successfully.");

    if (
      !existsSync(
        Path.join(
          `${rootPath}/`,
          `libs/${domainName}/types/__generated__/models.ts`
        )
      )
    ) {
      printError(
        `The file location ${Path.join(
          `${rootPath}/`,
          `libs/${domainName}/__generated__/models.ts`
        )} could no be found... Something went wrong!`
      );
      return { success: false };
    }

    printInfo('Renaming index file in "__generated__" folder');
    result = await execute(
      `ren "${Path.join(
        `${rootPath}/`,
        `libs/${domainName}/types/__generated__/models.ts`
      )}" "index.ts"`
    );
    if (result) {
      printError(result);
      return { success: false };
    }
    printSuccess("Renamed index file successfully.");

    return { success: !result };
  } catch (e) {
    console.error(e);

    return { success: false };
  }
}
