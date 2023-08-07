import { Model } from "@open-system/tools-storm-language/ast";
import { PluginOptions } from "@open-system/tools-storm-sdk";
import type { DMMF } from "@prisma/generator-helper";
import PrismaSchemaGenerator from "./schema-generator";

export const name = "Prisma";

export default async function run(
  model: Model,
  options: PluginOptions,
  _dmmf?: DMMF.Document,
  config?: Record<string, string>
) {
  return new PrismaSchemaGenerator().generate(model, options, config);
}
