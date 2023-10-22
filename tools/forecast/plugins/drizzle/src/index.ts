import {
  PluginHandler,
  TemplateGenerator,
  createTemplatePluginHandler
} from "@stormstack/tools-forecast-codegen";
import { DrizzlePluginOptions } from "./types";
import { filterDrizzleTemplates } from "./utils";

export const name = "Drizzle ORM Generator";

export const generator = new TemplateGenerator<DrizzlePluginOptions>();

export const handle: PluginHandler<DrizzlePluginOptions> =
  createTemplatePluginHandler(
    {
      templatePath: "templates/**",
      dataModelTemplatePath: "templates/schemas/**",
      enumTemplatePath: "templates/enums/**"
    },
    filterDrizzleTemplates
  );
