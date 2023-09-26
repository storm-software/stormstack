import type { DMMF } from "@prisma/generator-helper";
import { getDMMF as getDMMF5 } from "@prisma/internals";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import {
  GeneratorDecl,
  Model,
  Plugin,
  isGeneratorDecl,
  isPlugin
} from "@stormstack/tools-forecast-language/ast";
import { dirname, isAbsolute, posix, relative, resolve, sep } from "path";
import { getLiteral } from "./utils";

/**
 * Given a Storm and an import context directory, compute the import spec for the Prisma Client.
 */
export function getPrismaClientImportSpec(
  model: Model,
  importingFromDir: string
) {
  const generator = model.declarations.find(
    d =>
      isGeneratorDecl(d) &&
      d.fields.some(
        f => f.name === "provider" && getLiteral(f.value) === "prisma-client-js"
      )
  ) as GeneratorDecl;

  const clientOutputField = generator?.fields.find(f => f.name === "output");
  const clientOutput = getLiteral(clientOutputField?.value);

  if (!clientOutput) {
    // no user-declared Prisma Client output location
    return "@prisma/client";
  }

  if (isAbsolute(clientOutput)) {
    // absolute path
    return clientOutput;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const stormDir = dirname(model.$document!.uri.fsPath);

  // compute prisma schema absolute output path
  let prismaSchemaOutputDir = resolve(stormDir, "./prisma");
  const prismaPlugin = model.declarations.find(
    d =>
      isPlugin(d) &&
      d.fields.some(
        f => f.name === "provider" && getLiteral(f.value) === "@core/prisma"
      )
  ) as Plugin;
  if (prismaPlugin) {
    const output = getLiteral(
      prismaPlugin.fields.find(f => f.name === "output")?.value
    );
    if (output) {
      if (isAbsolute(output)) {
        // absolute prisma schema output path
        prismaSchemaOutputDir = dirname(output);
      } else {
        prismaSchemaOutputDir = dirname(resolve(stormDir, output));
      }
    }
  }

  // resolve the prisma client output path, which is relative to the prisma schema
  const resolvedPrismaClientOutput = resolve(
    prismaSchemaOutputDir,
    clientOutput
  );

  // DEBUG:
  ConsoleLogger.log(`PRISMA SCHEMA PATH: ${prismaSchemaOutputDir}`);
  ConsoleLogger.log(`PRISMA CLIENT PATH: ${resolvedPrismaClientOutput}`);
  ConsoleLogger.log(`IMPORTING PATH: ${importingFromDir}`);

  // compute prisma client absolute output dir relative to the importing file
  return normalizePath(relative(importingFromDir, resolvedPrismaClientOutput));
}

function normalizePath(p: string) {
  return p ? p.split(sep).join(posix.sep) : p;
}

export type GetDMMFOptions = {
  datamodel?: string;
  cwd?: string;
  prismaPath?: string;
  datamodelPath?: string;
  retry?: number;
  previewFeatures?: string[];
};

/**
 * Loads Prisma DMMF with appropriate version
 */
export function getDMMF(options: GetDMMFOptions): Promise<DMMF.Document> {
  // const prismaVersion = getPrismaVersion();

  return getDMMF5(options);
}
