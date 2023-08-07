import { Model } from "@open-system/tools-storm-language";
import { PluginOptions } from "@open-system/tools-storm-sdk";
import type { DMMF } from "@prisma/generator-helper";
import { generate } from "./generator";

export const name = "Zod";

export default async function run(
  model: Model,
  options: PluginOptions,
  dmmf: DMMF.Document
) {
  return generate(model, options, dmmf);
}
