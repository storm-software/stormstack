import { ProcessingError } from "@stormstack/core-shared-utilities";
import { AstNode } from "@stormstack/tools-forecast-language/ast";
import { readFile } from "fs/promises";
import { glob } from "glob";
import {
  PluginHandler,
  TemplatePluginOptions,
  TemplatePluginPaths,
  type Context
} from "../types";
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
    const templates = await getTemplates(
      templatePaths.templatePath,
      options.templatePath
    );

    const generated = await Promise.all(
      templates.map(template =>
        getGenerated(options, context, context.model, generator, template)
      )
    );

    await Promise.all(
      generated.map(file => generator.write(options, file.content, file.name))
    );

    await generator.save(options);
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
    const name = templateName.endsWith(".template")
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
