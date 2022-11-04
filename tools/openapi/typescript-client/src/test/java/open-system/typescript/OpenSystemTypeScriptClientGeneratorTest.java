package opensystem.typescript.client;

import org.junit.Test;
import org.openapitools.codegen.ClientOptInput;
import org.openapitools.codegen.DefaultGenerator;
import org.openapitools.codegen.config.CodegenConfigurator;

/***
 * This test allows you to easily launch your code generation software under a debugger.
 * Then run this test under debug mode.  You will be able to step through your java code
 * and then see the results in the out directory.
 *
 * To experiment with debugging your code generator:
 * 1) Set a break point in OpenSystemTypeScriptClientGenerator.java in the postProcessOperationsWithModels() method.
 * 2) To launch this test in Eclipse: right-click | Debug As | JUnit Test
 *
 */
public class OpenSystemTypeScriptClientGeneratorTest {

  // use this test to launch you code generator in the debugger.
  // this allows you to easily set break points in MyclientcodegenGenerator.
  @Test
  public void launchCodeGenerator() {
    // to understand how the 'openapi-generator-cli' module is using 'CodegenConfigurator', have a look at the 'Generate' class:
    // https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator-cli/src/main/java/org/openapitools/codegen/cmd/Generate.java
    final CodegenConfigurator configurator = new CodegenConfigurator()
              .setGeneratorName("open-system-typescript-client") // use this codegen library
              .setInputSpec("test.api.json") // sample OpenAPI file
              // .setInputSpec("https://raw.githubusercontent.com/openapitools/openapi-generator/master/modules/openapi-generator/src/test/resources/2_0/petstore.yaml") // or from the server
              .setOutputDir("out-test/test") // output directory
                .addAdditionalProperty("libraryName", "test")
                .addAdditionalProperty("platform", "browser")
                .addAdditionalProperty("framework", "fetch-api")
                .addAdditionalProperty("supportsES6", "true")
                .addAdditionalProperty("npmName", "message")
                .addAdditionalProperty("isBasicBearer", "true")
                .addAdditionalProperty("useObjectParameters", "true")
                .addAdditionalProperty("modelNameSuffix", "Dto")
                //.addAdditionalProperty("remove-operation-id-prefix", "true")
                .addAdditionalProperty("useInversify", "true");
    final ClientOptInput clientOptInput = configurator.toClientOptInput();
    DefaultGenerator generator = new DefaultGenerator();
    generator.opts(clientOptInput).generate();
  }
}
