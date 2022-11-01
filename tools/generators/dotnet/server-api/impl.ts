import { Tree } from "@nrwl/devkit";
import { execute, printError, printInfo, printSuccess } from "../utilities";
import { ServerApiGeneratorSchema } from "./schema";

export default async function (host: Tree, options?: ServerApiGeneratorSchema) {
  try {
    printInfo(`Executing "server-api-sync" executor...`);
    printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    printInfo(`Current Directory: ${__dirname}`);

    const { domainName, serviceName, specJsonFile, generator, packageName } =
      options;

    printInfo("Generating Server API code...");

    const formattedServiceName = serviceName
      ? serviceName.charAt(0).toUpperCase() + serviceName.slice(1)
      : `${
          domainName.charAt(0).toUpperCase() + domainName.slice(1)
        }Service.Api`;

    const result = await execute(
      `java -cp tools/openapi/dotnet-server/target/open-system-dotnet-server-openapi-generator-1.0.0.jar;tools/openapi/openapi-generator-cli-6.2.1.jar org.openapitools.codegen.OpenAPIGenerator generate --input-spec=${specJsonFile} -g ${
        generator ?? "open-system-dotnet-server"
      } -o apps/apis/${domainName} --enable-post-process-file --global-property="apiDocs=true" --additional-properties="aspnetCoreVersion=6.0,buildTarget=program,licenseName=BSD 2-Clause License Simplified,licenseUrl=https://spdx.org/licenses/BSD-2-Clause.html,packageAuthors=Patrick Sullivan,packageCopyright=Copyright (c) 2022 Patrick Sullivan,packageDescription=A collection of ${domainName} APIs used by the Open System repository,packageName=${packageName},packageTitle=OpenSystem,packageVersion=1.0.0,projectSdk=Microsoft.NET.Sdk.Web,operationIsAsync=true,operationResultTask=true,nullableReferenceTypes=true,isBasicBearer=true,pocoModels=false,useSwashbuckle=true,enumNameSuffix=Options,enumValueSuffix=,modelNameSuffix=Dto,generateAliasAsModel=true,domainName=${domainName},serviceName=${formattedServiceName},specJsonFile=${specJsonFile},sourceRoot=${`apps/apis/${domainName}`}",dockerTag=${formattedServiceName.toLowerCase()}:latest,useDateTimeOffsetFlag=true,optionalEmitDefaultValuesFlag=true `
    );

    if (result) {
      printError(result);
      return { success: false };
    }
    printSuccess("API generation succeeded.");

    return { success: !result };
  } catch (e) {
    printError(e);

    return { success: false };
  }
}
