import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { JsonParser } from "@stormstack/core-shared-serialization";
import { EMPTY_STRING } from "@stormstack/core-shared-utilities";
import {
  AstNode,
  DataModel,
  Enum
} from "@stormstack/tools-forecast-language/ast";
import { lstatSync } from "fs";
import { readFile } from "fs/promises";
import { glob } from "glob";
import { join } from "path";
import {
  PluginHandler,
  TEMPLATE_EXTENSIONS,
  TemplatePluginOptions,
  TemplatePluginPaths,
  type Context
} from "../types";
import {
  getApiModels,
  getDataModels,
  getInputs,
  getInterfaces,
  getOperationGroups
} from "../utils";
import { TypescriptGenerator } from "./generators/typescript-generator";

export type TemplateDetails = {
  name: string;
  content: string;
};

/**
 * Runs the core functionality of a template style plugin generator
 */
export const createTemplatePluginHandler =
  <TOptions extends TemplatePluginOptions = TemplatePluginOptions>(
    templatePaths: TemplatePluginPaths,
    filterTemplates?: (
      options: TOptions,
      context: Context,
      generator: TypescriptGenerator<TOptions>,
      node: AstNode | null,
      templates: Array<TemplateDetails>
    ) => Array<TemplateDetails>
  ): PluginHandler<TOptions> =>
  async (
    options: TOptions,
    context: Context,
    generator: TypescriptGenerator<TOptions>
  ) => {
    ConsoleLogger.info(
      `Generating templates with options:
${JsonParser.stringify(options)}`
    );

    let templates = await getTemplates(
      context,
      templatePaths.templatePath,
      options.templatePath
    );

    // Allow the plugin to filter the templates to be used
    // based on the options and context
    if (filterTemplates) {
      templates = filterTemplates(options, context, generator, null, templates);
    }

    // Remove any templates that are meant to be specific to a model node
    templates = templates.filter(
      (template: TemplateDetails) => !template.name.includes("__name__")
    );

    const model = context.model;
    let generated = await Promise.all(
      templates.map(template =>
        getGeneratedContent(options, context, model, generator, template)
      )
    );

    await Promise.all(
      generated.map(file => generator.write(options, file.content, file.name))
    );

    if (templatePaths.dataModelTemplatePath) {
      const dataModels = getDataModels(model);
      if (dataModels && dataModels.length > 0) {
        ConsoleLogger.info(
          `Running template based generation for ${dataModels.length} data models`
        );

        await generateNodeTemplates(
          templatePaths.dataModelTemplatePath,
          options,
          context,
          dataModels,
          generator,
          filterTemplates
        );
      }
    }

    if (templatePaths.apiModelTemplatePath) {
      const apiModels = getApiModels(model);
      if (apiModels && apiModels.length > 0) {
        ConsoleLogger.info(
          `Running template based generation for ${apiModels.length} api models`
        );

        await generateNodeTemplates(
          templatePaths.apiModelTemplatePath,
          options,
          context,
          apiModels,
          generator,
          filterTemplates
        );
      }
    }

    if (templatePaths.interfaceTemplatePath) {
      const interfaces = getInterfaces(model);
      if (interfaces && interfaces.length > 0) {
        ConsoleLogger.info(
          `Running template based generation for ${interfaces.length} interfaces`
        );

        await generateNodeTemplates(
          templatePaths.interfaceTemplatePath,
          options,
          context,
          interfaces,
          generator,
          filterTemplates
        );
      }
    }

    if (templatePaths.operationGroupsTemplatePath) {
      const operationGroups = getOperationGroups(model);
      if (operationGroups && operationGroups.length > 0) {
        ConsoleLogger.info(
          `Running template based generation for ${operationGroups.length} operation groups`
        );

        await generateNodeTemplates(
          templatePaths.operationGroupsTemplatePath,
          options,
          context,
          operationGroups,
          generator,
          filterTemplates
        );
      }
    }

    if (templatePaths.inputTemplatePath) {
      const inputs = getInputs(model);
      if (inputs && inputs.length > 0) {
        ConsoleLogger.info(
          `Running template based generation for ${inputs.length} inputs`
        );

        await generateNodeTemplates(
          templatePaths.inputTemplatePath,
          options,
          context,
          inputs,
          generator,
          filterTemplates
        );
      }
    }

    if (templatePaths.enumTemplatePath) {
      const enums: Enum[] = model.declarations.reduce((ret, decl) => {
        if (decl.$type === Enum) {
          ret.push(decl as Enum);
        }

        return ret;
      }, []);

      if (enums && enums.length > 0) {
        ConsoleLogger.info(
          `Running template based generation for ${enums.length} enums`
        );

        await generateNodeTemplates(
          templatePaths.enumTemplatePath,
          options,
          context,
          enums,
          generator,
          filterTemplates
        );
      }
    }

    await generator.save(options);
  };

const generateNodeTemplates = async <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  templatePath: string | string[],
  options: TOptions,
  context: Context,
  nodes: AstNode[],
  generator: TypescriptGenerator<TOptions>,
  filterTemplates?: (
    options: TOptions,
    context: Context,
    generator: TypescriptGenerator<TOptions>,
    node: AstNode | null,
    templates: Array<TemplateDetails>
  ) => Array<TemplateDetails>
) => {
  let templates = await getTemplates(context, templatePath);

  for (const node of nodes) {
    let nodeTemplates = Array.from(templates);

    ConsoleLogger.info(
      `Filtering the following templates: ${nodeTemplates
        .map(nodeTemplate => nodeTemplate.name)
        .join(", ")}`
    );

    // Allow the plugin to filter the templates to be used
    // based on the options and context
    if (filterTemplates) {
      nodeTemplates = filterTemplates(
        options,
        context,
        generator,
        node,
        nodeTemplates
      );
    }

    ConsoleLogger.info(
      `Generating files for the following templates: ${nodeTemplates
        .map(nodeTemplate => nodeTemplate.name)
        .join(", ")}`
    );

    const generated = await Promise.all(
      nodeTemplates.map(nodeTemplate =>
        getGeneratedContent(options, context, node, generator, nodeTemplate)
      )
    );

    await Promise.all(
      generated.map(file => generator.write(options, file.content, file.name))
    );
  }
};

export const getGeneratedContent = async <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  options: TOptions,
  context: Context,
  node: AstNode,
  generator: TypescriptGenerator<TOptions>,
  template: TemplateDetails
): Promise<{ name: string; content: string }> => {
  const content = await generator.generate(options, node, context, template);

  const name = formatFileName(
    template.name
      .replace(__dirname, "")
      .replace(
        context.plugins.details[context.plugins.current]?.module?.resolvedPath,
        ""
      ),
    node
  );

  ConsoleLogger.info(`Generated file "${name}":
${content}`);

  return {
    name,
    content
  };
};

export const getTemplates = async (
  context: Context,
  defaultPath: string | string[],
  optionsPath?: string | string[]
): Promise<Array<TemplateDetails>> => {
  const paths = mergePaths(defaultPath, optionsPath);
  if (!paths || (Array.isArray(paths) && paths.length === 0)) {
    return [];
  }

  const templateNames = await getTemplateNames(context, paths);
  if (!templateNames || templateNames.length === 0) {
    ConsoleLogger.warn(`No template files found in ${paths.join(", ")}`);
    return [];
  }

  ConsoleLogger.info(
    `Found the following template files ${paths.join(
      ", "
    )}: ${templateNames.join(", ")}}`
  );

  return Promise.all(templateNames.map(getTemplate));
};

const formatFileName = (fileName: string, node?: AstNode): string => {
  let result = TEMPLATE_EXTENSIONS.reduce((ret: string, ext: string) => {
    ret.endsWith(ext);

    return ret;
  }, fileName).replace("templates", "");

  if (node) {
    result = result.replace(
      "__name__",
      (node as DataModel)?.name ?? node.$type ?? EMPTY_STRING
    );
  }

  return result;
};

const getTemplate = async (templateName: string): Promise<TemplateDetails> => {
  const content = await readFile(templateName, { encoding: "utf8" });

  return {
    name: templateName,
    content
  };
};

const getTemplateNames = async (
  context: Context,
  path: string | string[]
): Promise<string[]> => {
  if (!path || (Array.isArray(path) && path.length === 0)) {
    return [];
  }

  if (Array.isArray(path)) {
    return (
      await Promise.all(path.map(p => getTemplateNames(context, p)))
    ).reduce((ret: string[], templateNamesListItem: string[]) => {
      templateNamesListItem.forEach((templateName: string) => {
        if (!ret.includes(templateName)) {
          ret.push(templateName);
        }
      });

      return ret;
    }, []);
  }

  ConsoleLogger.info(
    `Checking for template files in ${__dirname} with ${path}`
  );

  let templatePath = __dirname;
  let templateNames = await glob(path, {
    ignore: "node_modules/**",
    cwd: __dirname
  });
  if (!templateNames || templateNames.length === 0) {
    // Try getting the templates from the path of the plugin
    const resolvedPath =
      context.plugins.details[context.plugins.current]?.module?.resolvedPath;
    if (resolvedPath) {
      ConsoleLogger.info(
        `Checking for template files in ${resolvedPath} with ${path}`
      );

      templatePath = resolvedPath;
      templateNames = await glob(path, {
        ignore: "node_modules/**",
        cwd: resolvedPath
      });
    }
  }

  return templateNames.reduce((ret: string[], templateName: string) => {
    const fullPath = join(templatePath, templateName);

    if (
      lstatSync(fullPath).isFile() &&
      TEMPLATE_EXTENSIONS.some((ext: string) => fullPath.endsWith(ext)) &&
      !ret.includes(fullPath)
    ) {
      ret.push(fullPath);
    }

    return ret;
  }, []);
};

const mergePaths = (
  defaultPath: string | string[],
  optionsPath?: string | string[]
): string[] => {
  const paths = [];
  if (Array.isArray(defaultPath)) {
    paths.push(...defaultPath);
  } else if (defaultPath) {
    paths.push(defaultPath);
  }

  if (optionsPath) {
    if (Array.isArray(optionsPath)) {
      paths.push(...optionsPath);
    } else if (optionsPath) {
      paths.push(optionsPath);
    }
  }

  return paths;
};
