import { Tree } from "@nx/devkit";
import { ConsoleLogger } from "@open-system/core-utilities";
import { execute } from "../utilities";
import { ServerApiGeneratorSchema } from "./schema";

export default async function (host: Tree, options?: ServerApiGeneratorSchema) {
  try {
    ConsoleLogger.info(`Executing "server-api-sync" executor...`);
    ConsoleLogger.info(`Options: ${JSON.stringify(options, null, 2)}`);
    ConsoleLogger.info(`Current Directory: ${__dirname}`);

    const { domainName, serviceName, specJsonFile, generator, packageName } =
      options;

    ConsoleLogger.info("Generating Server API code...");

    const fullServiceName = `${
      domainName
        ? domainName.charAt(0).toUpperCase() + domainName.slice(1)
        : serviceName.charAt(0).toUpperCase() + serviceName.slice(1)
    }Service.Api`;
    const projectName = options.projectName
      ? options.projectName
      : `apis-${domainName ?? serviceName}`;
    const sourceRoot = options.sourceRoot
      ? options.sourceRoot
      : `apps/apis/${domainName ? domainName : serviceName}`;

    const result = await execute(
      `java -cp tools/openapi/dotnet-server/target/open-system-dotnet-server-openapi-generator-1.0.0.jar;tools/openapi/openapi-generator-cli-6.2.1.jar org.openapitools.codegen.OpenAPIGenerator generate --input-spec=${specJsonFile} -g ${
        generator ?? "open-system-dotnet-server"
      } -o ${sourceRoot} --enable-post-process-file --global-property="apiDocs=true" --additional-properties="aspnetCoreVersion=7.0,buildTarget=program,licenseName=BSD 2-Clause License Simplified,licenseUrl=https://spdx.org/licenses/BSD-2-Clause.html,packageAuthors=Patrick Sullivan,packageCopyright=Copyright (c) 2022 Patrick Sullivan,packageDescription=A collection of ${
        domainName ?? serviceName
      } APIs used by the Open System repository,packageName=${packageName},packageTitle=OpenSystem,packageVersion=1.0.0,projectSdk=Microsoft.NET.Sdk.Web,operationIsAsync=true,operationResultTask=true,nullableReferenceTypes=true,isBasicBearer=true,pocoModels=false,useSwashbuckle=true,enumNameSuffix=Options,enumValueSuffix=,modelNameSuffix=Dto,generateAliasAsModel=true,domainName=${domainName},serviceName=${
        serviceName ?? `${domainName}_apis`
      },fullServiceName=${fullServiceName},specJsonFile=${specJsonFile},sourceRoot=${sourceRoot}",dockerTag=${projectName}:latest,useDateTimeOffsetFlag=true,optionalEmitDefaultValuesFlag=true,projectName=${projectName},useNewtonsoft=false,useDefaultRouting=true `
    );

    if (result) {
      ConsoleLogger.error(result);
      return { success: false };
    }
    ConsoleLogger.success("API generation succeeded.");

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(e);

    return { success: false };
  }
}
