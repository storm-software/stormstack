import type { DMMF } from "@prisma/generator-helper";
import { Model } from "@stormstack/tools-storm-language/ast";
import { PluginOptions } from "@stormstack/tools-storm-schema/sdk";
import { generate } from "./generator";

export const name = "Drizzle";

export default async function run(
  model: Model,
  options: PluginOptions,
  dmmf: DMMF.Document
) {
  return generate(model, options, dmmf);
}
