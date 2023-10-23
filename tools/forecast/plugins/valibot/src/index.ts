import {
  PluginHandler,
  TemplateGenerator,
  createTemplatePluginHandler
} from "@stormstack/tools-forecast-codegen";
import { ValibotPluginOptions } from "./types";

export const name = "Valibot Schema Generator";

export const generator = new TemplateGenerator<ValibotPluginOptions>();

export const handle: PluginHandler<ValibotPluginOptions> =
  createTemplatePluginHandler({
    partialsPath: "templates/partials/**",
    dataModelTemplatePath: "templates/data-models/**",
    enumTemplatePath: "templates/enums/**",
    apiModelTemplatePath: "templates/api-models/**",
    interfaceTemplatePath: "templates/interfaces/**",
    inputTemplatePath: "templates/inputs/**"
  });
