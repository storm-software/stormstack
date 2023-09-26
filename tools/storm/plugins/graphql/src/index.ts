/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DMMF } from "@prisma/generator-helper";
import { Model } from "@stormstack/tools-storm-language/ast";
import { PluginOptions } from "@stormstack/tools-storm-schema/sdk";
import { generate } from "./generator";

export const name = "GraphQL";

export default async function run(
  model: Model,
  options: PluginOptions,
  _dmmf?: DMMF.Document
) {
  return generate(model, options);
}
