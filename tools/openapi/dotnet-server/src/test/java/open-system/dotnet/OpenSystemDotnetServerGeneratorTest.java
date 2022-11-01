package opensystem.dotnet.server;

import org.junit.Test;
import org.openapitools.codegen.ClientOptInput;
import org.openapitools.codegen.DefaultGenerator;
import org.openapitools.codegen.config.CodegenConfigurator;
import org.openapitools.codegen.ClientOptInput;

/***
 * This test allows you to easily launch your code generation software under a debugger.
 * Then run this test under debug mode.  You will be able to step through your java code
 * and then see the results in the out directory.
 *
 * To experiment with debugging your code generator:
 * 1) Set a break point in AspnetcoreGenerator.java in the postProcessOperationsWithModels() method.
 * 2) To launch this test in Eclipse: right-click | Debug As | JUnit Test
 *
 */
public class OpenSystemDotnetServerGeneratorTest {

  // use this test to launch you code generator in the debugger.
  // this allows you to easily set break points in MyclientcodegenGenerator.
  @Test
  public void launchCodeGenerator() {
    // to understand how the 'openapi-generator-cli' module is using 'CodegenConfigurator', have a look at the 'Generate' class:
    // https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator-cli/src/main/java/org/openapitools/codegen/cmd/Generate.java
    final CodegenConfigurator configurator = new CodegenConfigurator()
              .setGeneratorName("open-system-dotnet-server") // use this codegen library
              .setOutputDir("out-test/test") // output directory
              .setInputSpec("test.api.json") // sample OpenAPI file
                .addAdditionalProperty("aspnetCoreVersion", "6.0")
                .addAdditionalProperty("buildTarget", "program")
                /*.addAdditionalProperty("licenseName", "BSD 2-Clause License Simplified")
                .addAdditionalProperty("licenseUrl", "https://spdx.org/licenses/BSD-2-Clause.html")*/
                .addAdditionalProperty("packageAuthors", "Patrick Sullivan")
                .addAdditionalProperty("packageCopyright", "Copyright (c) 2022 Patrick Sullivan")
                .addAdditionalProperty("packageDescription", "A collection of shared APIs used by the Broadridge-FXL system")
                .addAdditionalProperty("packageName", "OpenSystem.Apps.APIs.Message")
                .addAdditionalProperty("packageTitle", "OpenSystem")
                .addAdditionalProperty("packageVersion", "1.0.0")
                .addAdditionalProperty("projectSdk", "Microsoft.NET.Sdk.Web")
                //.addAdditionalProperty("modelPackage", "BFXL.Apps.Server.Message.DTO")
                //.setModelPackage("BFXL.Apps.Server.Message.DTO")
                .addAdditionalProperty("optionalEmitDefaultValuesFlag", "true")
                .addAdditionalProperty("useDateTimeOffsetFlag", "true")
                .addAdditionalProperty("operationIsAsync", "true")
                .addAdditionalProperty("operationResultTask", "true")
                .addAdditionalProperty("nullableReferenceTypes", "true")
                .addAdditionalProperty("isBasicBearer", "true")
                .addAdditionalProperty("classModifier", "sealed")
                .addAdditionalProperty("pocoModels", "false")
                //.addAdditionalProperty("useSeperateModelProject", "true")
                .addAdditionalProperty("useSwashbuckle", "true")
                .addAdditionalProperty("enablePostProcessFile", "true")
                .addAdditionalProperty("enumNameSuffix", "Types")
                .addAdditionalProperty("enumValueSuffix", "")
                .addAdditionalProperty("modelNameSuffix", "Dto")
                .addAdditionalProperty("generateAliasAsModel", "true")
                .addAdditionalProperty("domainName", "message")
                .addAdditionalProperty("urlRoot", "message")
                .addAdditionalProperty("serviceName", "Message.API")
                .addAdditionalProperty("specJsonFile", "libs/static/message/api-spec.json")
                .addAdditionalProperty("sourceRoot", "apps/apis/message");
                //.setTemplateDir("src/main/resources/open-system-dotnet")
                //.setVerbose(true);

    final ClientOptInput clientOptInput = configurator.toClientOptInput();

    configurator.LOGGER.error(" *** templateDir *** ");
    // configurator.LOGGER.error(clientOptInput.getConfig().templateDir());
    // configurator.LOGGER.error(clientOptInput.getConfig().modelPackage());
    // configurator.LOGGER.error(clientOptInput.getConfig().apiPackage());

    DefaultGenerator generator = new DefaultGenerator();
    generator.opts(clientOptInput).generate();
  }
}
