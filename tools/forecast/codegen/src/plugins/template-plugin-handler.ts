import { ProcessingError } from "@stormstack/core-shared-utilities";
import {
  AstNode,
  DataModel,
  Enum
} from "@stormstack/tools-forecast-language/ast";
import { readFile } from "fs/promises";
import { glob } from "glob";
import {
  PluginHandler,
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

/**
 * Runs the core functionality of a plugin generator
 */
export const createTemplatePluginHandler =
  <TOptions extends TemplatePluginOptions = TemplatePluginOptions>(
    templatePaths: TemplatePluginPaths
  ): PluginHandler<TOptions> =>
  async (
    options: TOptions,
    context: Context,
    generator: TypescriptGenerator<TOptions>
  ) => {
    let templates = await getTemplates(
      templatePaths.templatePath,
      options.templatePath
    );

    const model = context.model;
    let generated = await Promise.all(
      templates.map(template =>
        getGenerated(options, context, model, generator, template)
      )
    );

    await Promise.all(
      generated.map(file =>
        generator.write(options, file.content, file.name.replace(".hbs", ""))
      )
    );

    if (templatePaths.dataModelTemplatePath) {
      const dataModels = getDataModels(model);
      if (dataModels && dataModels.length > 0) {
        await generateNodeTemplates(
          templatePaths.dataModelTemplatePath,
          options,
          context,
          dataModels,
          generator
        );
      }
    }

    if (templatePaths.apiModelTemplatePath) {
      const apiModels = getApiModels(model);
      if (apiModels && apiModels.length > 0) {
        await generateNodeTemplates(
          templatePaths.apiModelTemplatePath,
          options,
          context,
          apiModels,
          generator
        );
      }
    }

    if (templatePaths.interfaceTemplatePath) {
      const interfaces = getInterfaces(model);
      if (interfaces && interfaces.length > 0) {
        await generateNodeTemplates(
          templatePaths.interfaceTemplatePath,
          options,
          context,
          interfaces,
          generator
        );
      }
    }

    if (templatePaths.operationGroupsTemplatePath) {
      const operationGroups = getOperationGroups(model);
      if (operationGroups && operationGroups.length > 0) {
        await generateNodeTemplates(
          templatePaths.operationGroupsTemplatePath,
          options,
          context,
          operationGroups,
          generator
        );
      }
    }

    if (templatePaths.inputTemplatePath) {
      const inputs = getInputs(model);
      if (inputs && inputs.length > 0) {
        await generateNodeTemplates(
          templatePaths.inputTemplatePath,
          options,
          context,
          inputs,
          generator
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
        await generateNodeTemplates(
          templatePaths.enumTemplatePath,
          options,
          context,
          enums,
          generator
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
  generator: TypescriptGenerator<TOptions>
) => {
  if (nodes && nodes.length > 0) {
    const templates = await getTemplates(templatePath);

    for (const node of nodes) {
      const generated = await Promise.all(
        templates.map(template =>
          getGenerated(options, context, node, generator, template)
        )
      );

      await Promise.all(
        generated.map(file =>
          generator.write(
            options,
            file.content,
            file.name
              .replace(".hbs", "")
              .replace("__name__", (node as DataModel)?.name ?? node.$type)
          )
        )
      );
    }
  }
};

const getGenerated = async <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  options: TOptions,
  context: Context,
  node: AstNode,
  generator: TypescriptGenerator<TOptions>,
  template: {
    name: string;
    content: string;
  }
): Promise<{ name: string; content: string }> => {
  const content = await generator.generate(options, context.model, context, {
    template
  });

  return {
    name: template.name,
    content
  };
};

const getTemplateNames = async (path: string | string[]): Promise<string[]> => {
  if (Array.isArray(path)) {
    return (await Promise.all(path.map(getTemplateNames))).reduce(
      (ret: string[], templateNamesListItem: string[]) => {
        templateNamesListItem.forEach((templateName: string) => {
          if (!ret.includes(templateName)) {
            ret.push(templateName);
          }
        });
        return ret;
      },
      []
    );
  }

  return (
    await glob(path, {
      ignore: "node_modules/**"
    })
  ).reduce((ret: string[], templateName: string) => {
    const name = templateName.endsWith(".hbs")
      ? templateName.slice(0, -9)
      : templateName;
    if (!ret.includes(name)) {
      ret.push(name);
    }

    return ret;
  }, []);
};

const getTemplates = async (
  defaultPath: string | string[],
  optionsPath?: string | string[]
): Promise<Array<{ name: string; content: string }>> => {
  const paths = mergePaths(defaultPath, optionsPath);

  const templateNames = await getTemplateNames(paths);
  if (templateNames?.length === 0) {
    throw new ProcessingError(`No template files found in ${paths.join(", ")}`);
  }

  return Promise.all(templateNames.map(getTemplate));
};

const getTemplate = async (
  templateName: string
): Promise<{ name: string; content: string }> => {
  const content = await readFile(templateName, { encoding: "utf8" });

  return {
    name: templateName,
    content
  };
};

const mergePaths = (
  defaultPath: string | string[],
  optionsPath?: string | string[]
): string[] => {
  const paths = [];
  if (Array.isArray(defaultPath)) {
    paths.push(...defaultPath);
  } else {
    paths.push(defaultPath);
  }

  if (optionsPath) {
    if (Array.isArray(optionsPath)) {
      paths.push(...optionsPath);
    } else {
      paths.push(optionsPath);
    }
  }

  return paths;
};
