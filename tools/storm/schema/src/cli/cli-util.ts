import {
  isDataSource,
  isPlugin,
  Model,
} from "@open-system/tools-storm-language/ast";
import { getLiteral, PluginError } from "@open-system/tools-storm-sdk";
import chalk from "chalk";
import fs from "fs";
import getLatestVersion from "get-latest-version";
import {
  AstNode,
  getDocument,
  LangiumDocument,
  LangiumDocuments,
  Mutable,
} from "langium";
import { NodeFileSystem } from "langium/node";
import ora from "ora";
import path from "path";
import semver from "semver";
import { URI } from "vscode-uri";
import {
  PLUGIN_MODULE_NAME,
  STD_LIB_MODULE_NAME,
} from "../language-server/constants";
import {
  createStormServices,
  StormServices,
} from "../language-server/storm-module";
import { Context } from "../types";
import {
  mergeBaseModel,
  resolveImport,
  resolveTransitiveImports,
} from "../utils/ast-utils";
import {
  ensurePackage,
  installPackage,
  PackageManagers,
} from "../utils/pkg-utils";
import { getVersion } from "../utils/version-utils";
import { CliError } from "./cli-error";
import { PluginRunner } from "./plugin-runner";

/**
 * Initializes an existing project for ZenStack
 */
export async function initProject(
  projectPath: string,
  prismaSchema: string | undefined,
  packageManager: PackageManagers | undefined,
  tag?: string
) {
  if (!fs.existsSync(projectPath)) {
    console.error(`Path does not exist: ${projectPath}`);
    throw new CliError("project path does not exist");
  }

  const defaultPrismaSchemaLocation = "./prisma/schema.prisma";
  if (prismaSchema) {
    if (!fs.existsSync(prismaSchema)) {
      console.error(`Prisma schema file does not exist: ${prismaSchema}`);
      throw new CliError("prisma schema does not exist");
    }
  } else if (fs.existsSync(defaultPrismaSchemaLocation)) {
    prismaSchema = defaultPrismaSchemaLocation;
  }

  const stormFile = path.join(projectPath, "./schema.storm");
  let sampleModelGenerated = false;

  if (fs.existsSync(stormFile)) {
    console.warn(
      `ZenStack model already exists at ${stormFile}, not generating a new one.`
    );
  } else {
    if (prismaSchema) {
      // copy over schema.prisma
      fs.copyFileSync(prismaSchema, stormFile);
    } else {
      // create a new model
      const starterContent = fs.readFileSync(
        path.join(__dirname, "../res/starter.storm"),
        "utf-8"
      );
      fs.writeFileSync(stormFile, starterContent);
      sampleModelGenerated = true;
    }
  }

  ensurePackage("prisma", true, packageManager, "latest", projectPath);
  ensurePackage("@prisma/client", false, packageManager, "latest", projectPath);

  tag = tag ?? getVersion();
  installPackage("storm", true, packageManager, tag, projectPath);
  installPackage(
    "@open-system/runtime",
    false,
    packageManager,
    tag,
    projectPath
  );

  if (sampleModelGenerated) {
    console.log(`Sample model generated at: ${chalk.blue(stormFile)}

Please check the following guide on how to model your app:
    https://zenstack.dev/#/modeling-your-app.`);
  } else if (prismaSchema) {
    console.log(
      `Your current Prisma schema "${prismaSchema}" has been copied to "${stormFile}".
Moving forward please edit this file and run "zenstack generate" to regenerate Prisma schema.`
    );
  }

  console.log(chalk.green("\nProject initialized successfully!"));
}

/**
 * Loads a storm document from a file.
 * @param fileName File name
 * @param services Language services
 * @returns Parsed and validated AST
 */
export async function loadDocument(fileName: string): Promise<Model> {
  const services = createStormServices(NodeFileSystem).Storm;
  const extensions = services.LanguageMetaData.fileExtensions;
  if (!extensions.includes(path.extname(fileName))) {
    console.error(
      chalk.yellow(`Please choose a file with extension: ${extensions}.`)
    );
    throw new CliError("invalid schema file");
  }

  if (!fs.existsSync(fileName)) {
    console.error(chalk.red(`File ${fileName} does not exist.`));
    throw new CliError("schema file does not exist");
  }

  // load standard library
  const stdLib = services.shared.workspace.LangiumDocuments.getOrCreateDocument(
    URI.file(path.resolve(path.join(__dirname, "../res", STD_LIB_MODULE_NAME)))
  );

  // load documents provided by plugins
  const pluginDocuments = await getPluginDocuments(services, fileName);

  const langiumDocuments = services.shared.workspace.LangiumDocuments;
  // load the document
  const document = langiumDocuments.getOrCreateDocument(
    URI.file(path.resolve(fileName))
  );

  // load all imports
  const importedURIs = eagerLoadAllImports(document, langiumDocuments);

  const importedDocuments = importedURIs.map(uri =>
    langiumDocuments.getOrCreateDocument(uri)
  );

  // build the document together with standard library and plugin modules
  await services.shared.workspace.DocumentBuilder.build(
    [stdLib, ...pluginDocuments, document, ...importedDocuments],
    {
      validationChecks: "all",
    }
  );

  const validationErrors = langiumDocuments.all
    .flatMap(d => d.diagnostics ?? [])
    .filter(e => e.severity === 1)
    .toArray();

  if (validationErrors.length > 0) {
    console.error(chalk.red("Validation errors:"));
    for (const validationError of validationErrors) {
      console.error(
        chalk.red(
          `line ${validationError.range.start.line + 1}: ${
            validationError.message
          } [${document.textDocument.getText(validationError.range)}]`
        )
      );
    }
    throw new CliError("schema validation errors");
  }

  const model = document.parseResult.value as Model;

  mergeImportsDeclarations(langiumDocuments, model);

  validationAfterMerge(model);

  mergeBaseModel(model);

  return model;
}

// check global unique thing after merge imports
function validationAfterMerge(model: Model) {
  const dataSources = model.declarations.filter(d => isDataSource(d));
  if (dataSources.length == 0) {
    console.error(
      chalk.red("Validation errors: Model must define a datasource")
    );
    throw new CliError("schema validation errors");
  } else if (dataSources.length > 1) {
    console.error(
      chalk.red(
        "Validation errors: Multiple datasource declarations are not allowed"
      )
    );
    throw new CliError("schema validation errors");
  }
}

export function eagerLoadAllImports(
  document: LangiumDocument,
  documents: LangiumDocuments,
  uris: Set<string> = new Set()
) {
  const uriString = document.uri.toString();
  if (!uris.has(uriString)) {
    uris.add(uriString);
    const model = document.parseResult.value as Model;

    for (const imp of model.imports) {
      const importedModel = resolveImport(documents, imp);
      if (importedModel) {
        const importedDoc = getDocument(importedModel);
        eagerLoadAllImports(importedDoc, documents, uris);
      }
    }
  }

  return Array.from(uris)
    .filter(x => uriString != x)
    .map(e => URI.parse(e));
}

export function mergeImportsDeclarations(
  documents: LangiumDocuments,
  model: Model
) {
  const importedModels = resolveTransitiveImports(documents, model);

  const importedDeclarations = importedModels.flatMap(m => m.declarations);

  importedDeclarations.forEach(d => {
    const mutable = d as Mutable<AstNode>;
    // The plugin might use $container to access the model
    // need to make sure it is always resolved to the main model
    mutable.$container = model;
  });

  model.declarations.push(...importedDeclarations);
}

export async function getPluginDocuments(
  services: StormServices,
  fileName: string
): Promise<LangiumDocument[]> {
  // parse the user document (without validation)
  const parseResult = services.parser.LangiumParser.parse(
    fs.readFileSync(fileName, { encoding: "utf-8" })
  );
  const parsed = parseResult.value as Model;

  // traverse plugins and collect "plugin.storm" documents
  const result: LangiumDocument[] = [];
  parsed.declarations.forEach(decl => {
    if (isPlugin(decl)) {
      const providerField = decl.fields.find(f => f.name === "provider");
      if (providerField) {
        const provider = getLiteral<string>(providerField.value);
        if (provider) {
          try {
            const pluginEntrance = require.resolve(`${provider}`);
            const pluginModelFile = path.join(
              path.dirname(pluginEntrance),
              PLUGIN_MODULE_NAME
            );
            if (fs.existsSync(pluginModelFile)) {
              result.push(
                services.shared.workspace.LangiumDocuments.getOrCreateDocument(
                  URI.file(pluginModelFile)
                )
              );
            }
          } catch {
            // noop
          }
        }
      }
    }
  });
  return result;
}

export async function runPlugins(options: {
  schema: string;
  packageManager: PackageManagers | undefined;
  outDir?: string;
}) {
  const model = await loadDocument(options.schema);

  const context: Context = {
    schema: model,
    schemaPath: path.resolve(options.schema),
    outDir: options?.outDir ?? path.dirname(options.schema),
  };

  try {
    await new PluginRunner().run(context);
  } catch (err) {
    if (err instanceof PluginError) {
      console.error(chalk.red(`${err.plugin}: ${err.message}`));
      throw new CliError(err.message);
    } else {
      throw err;
    }
  }
}

export async function dumpInfo(projectPath: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pkgJson: any;
  const resolvedPath = path.resolve(projectPath);
  try {
    pkgJson = require(path.join(resolvedPath, "package.json"));
  } catch {
    console.error(
      "Unable to locate package.json. Are you in a valid project directory?"
    );
    return;
  }
  const packages = [
    "storm",
    ...Object.keys(pkgJson.dependencies ?? {}).filter(p =>
      p.startsWith("@open-system/")
    ),
    ...Object.keys(pkgJson.devDependencies ?? {}).filter(p =>
      p.startsWith("@open-system/")
    ),
  ];

  const versions = new Set<string>();
  for (const pkg of packages) {
    try {
      const resolved = require.resolve(`${pkg}/package.json`, {
        paths: [resolvedPath],
      });
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const version = require(resolved).version;
      versions.add(version);
      console.log(`    ${chalk.green(pkg.padEnd(20))}\t${version}`);
    } catch {
      // noop
    }
  }

  if (versions.size > 1) {
    console.warn(
      chalk.yellow(
        "WARNING: Multiple versions of Storm packages detected. This may cause issues."
      )
    );
  } else if (versions.size > 0) {
    const spinner = ora("Checking npm registry").start();
    const latest = await getLatestVersion("storm");

    if (!latest) {
      spinner.fail("unable to check for latest version");
    } else {
      spinner.succeed();
      const version = [...versions][0];
      if (semver.gt(latest, version)) {
        console.log(`A newer version of Zenstack is available: ${latest}.`);
      } else if (semver.gt(version, latest)) {
        console.log("You are using a pre-release version of Storm.");
      } else {
        console.log("You are using the latest version of Storm.");
      }
    }
  }
}
