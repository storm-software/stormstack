import { TemplateContext } from "@asyncapi/generator-react-sdk";
import {
  CSharpGenerator,
  CSHARP_JSON_SERIALIZER_PRESET,
  FormatHelpers,
} from "@asyncapi/modelina";
import { FileRenderer, Logger } from "../../utils";

export default async function modelRenderer({
  asyncapi,
  params,
}: TemplateContext) {
  Logger.info("Generating models");
  Logger.info(JSON.stringify(asyncapi));
  Logger.info(`{
    pdf: ${params.pdf},
    png: ${params.png},
    svg: ${params.svg},
    maxTextSize: ${params.maxTextSize},
    namespace: ${params.namespace},
    user: ${params.user},
    password: ${params.password},
    server: ${params.server}
  }`);

  const files = [];
  try {
    const generator = new CSharpGenerator({
      presets: [CSHARP_JSON_SERIALIZER_PRESET],
      processorOptions: { typescript: { required: true } },
    });

    const generatedModels = await generator.generateCompleteModels(
      asyncapi as unknown as Record<string, unknown>,
      {
        namespace: `${params.namespace}.Models`,
      }
    );
    Logger.info(generatedModels);

    for (const generatedModel of generatedModels) {
      const className = FormatHelpers.toPascalCase(generatedModel.modelName);
      const modelFileName = `${className}.cs`;
      files.push(
        <FileRenderer name={modelFileName}>
          {generatedModel.result}
        </FileRenderer>
      );
    }
  } catch (e) {
    Logger.error(e);
  }

  return files;
}
