import { Model } from "@stormstack/tools-forecast-language/ast";
import { PluginOptions } from "../../../codegen/src/sdk";
import PolicyGenerator from "./policy-guard-generator";

export const name = "Access Policy";

export default async function run(model: Model, options: PluginOptions) {
  return new PolicyGenerator().generate(model, options);
}
