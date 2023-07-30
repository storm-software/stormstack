import { TemplateContext } from "@asyncapi/generator-react-sdk";
import { FormatHelpers } from "@asyncapi/modelina";
import { TypeScriptEventsGenerator } from "../generator/typescript-events-generator";
import { TypeScriptZodGenerator } from "../generator/typescript-zod-generator";
import { TS_INTEGRATION_EVENT_PRESET } from "../presets";
import { FileRenderer } from "../utils";

const modelRenderer = async ({ asyncapi, params }: TemplateContext) => {
  console.info("Generating models");
  // console.info(JSON.stringify(asyncapi));
  console.info(`{
    outputPath: ${params.outputPath},
    pdf: ${params.pdf},
    png: ${params.png},
    svg: ${params.svg},
    maxTextSize: ${params.maxTextSize},
    namespace: ${params.namespace},
    server: ${params.server}
  }`);

  const files = [];
  try {
    const modelGenerator = new TypeScriptEventsGenerator({
      renderTypes: true,
      modelType: "class",
      enumType: "enum",
      mapType: "record",
      moduleSystem: "ESM",
      version: Number(asyncapi.version()),
      presets: [
        {
          preset: TS_INTEGRATION_EVENT_PRESET,
          options: {
            marshalling: true,
          },
        },
      ] as any,
    });

    const generatedModels = await modelGenerator.generateCompleteModels(
      asyncapi,
      {
        exportType: "named",
      }
    );
    //console.info(generatedModels);

    let indexFile = "";
    for (const generatedModel of generatedModels) {
      const fileName = `${FormatHelpers.toParamCase(generatedModel.modelName)}`;
      indexFile += `export * from "./${fileName}";\n`;

      files.push(
        <FileRenderer name={`${fileName}.ts`}>
          {generatedModel.result}
        </FileRenderer>
      );
    }

    const schemaGenerator = new TypeScriptZodGenerator({
      renderTypes: true,
      modelType: "class",
      enumType: "enum",
      mapType: "record",
      moduleSystem: "ESM",
      version: Number(asyncapi.version()),
      presets: [
        {
          preset: TS_INTEGRATION_EVENT_PRESET,
          options: {
            marshalling: true,
          },
        },
      ] as any,
    });

    const generatedSchemas = await schemaGenerator.generateCompleteModels(
      asyncapi,
      {
        exportType: "named",
      }
    );
    //console.info(generatedSchemas);

    for (const generatedSchema of generatedSchemas) {
      const fileName = `${FormatHelpers.toParamCase(
        generatedSchema.modelName
      )}.schema`;
      indexFile += `export * from "./${fileName}";\n`;

      files.push(
        <FileRenderer name={`${fileName}.ts`}>
          {generatedSchema.result}
        </FileRenderer>
      );
    }

    files.push(<FileRenderer name="index.ts">{indexFile}</FileRenderer>);
  } catch (e) {
    console.error(e);
  }

  return files;
};

export default modelRenderer;
