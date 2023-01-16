import { File } from "@asyncapi/generator-react-sdk";
import {
  CSharpGenerator,
  CSHARP_JSON_SERIALIZER_PRESET,
  FormatHelpers,
} from "@asyncapi/modelina";
import React from "react";

/**
 * @typedef RenderArgument
 * @type {object}
 * @property {AsyncAPIDocument} asyncapi received from the generator.
 */

/**
 * Render all schema models
 * @param {RenderArgument} param0
 * @returns
 */
export default async function modelRenderer({ asyncapi, params }) {
  console.log("Generating models");
  console.log(JSON.stringify(asyncapi));
  console.log(`{
    pdf: ${params.pdf},
    png: ${params.png},
    svg: ${params.svg},
    maxTextSize: ${params.maxTextSize},
    namespace: ${params.namespace},
    user: ${params.user},
    password: ${params.password},
    server: ${params.server}
  }`);

  const generator = new CSharpGenerator({
    presets: [CSHARP_JSON_SERIALIZER_PRESET],
  });

  const generatedModels = await generator.generateCompleteModels(asyncapi, {
    namespace: `${params.namespace}.Models`,
  });
  console.log(JSON.stringify(generatedModels));

  const files: any[] = [];
  for (const generatedModel of generatedModels) {
    const className = FormatHelpers.toPascalCase(generatedModel.modelName);
    const modelFileName: any = `${className}.cs`;
    files.push(
      <File name={modelFileName} childrenContent={generatedModel.result} />
    );
  }
  return files;
}
