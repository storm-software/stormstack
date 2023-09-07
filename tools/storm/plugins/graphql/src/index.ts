/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model } from "@open-system/tools-storm-language/ast";
import { PluginOptions } from "@open-system/tools-storm-schema/sdk";
import type { DMMF } from "@prisma/generator-helper";
import { generate } from "./generator";

export const name = "GraphQL";

export default async function run(
  model: Model,
  options: PluginOptions,
  _dmmf?: DMMF.Document
) {
  return generate(model, options);
}
