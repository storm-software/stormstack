module.exports = {
  crud: {
    outputDir: "./src/__generated__/crud",
    prismaCaller: "prisma",
    disabled: false,
    builderImporter: "import { builder } from '../../builder';",
    inputsImporter: "import * as Inputs from '../inputs';",
    deleteOutputDirBeforeGenerate: true,
    exportEverythingInObjectsDotTs: true,
    prismaImporter: `import { Prisma } from '@prisma/client/contact';`,
    resolverImports: `\nimport { prisma } from '../../../../client';`,
    replacer(generated, position) {
      // replacer(generated, position) {
      //   return `// THIS CONTENT WAS INSERTED AT REPLACE. THE POSITION IS ${position}\n${generated}`
      // },

      //export const ContactAttachmentObject = definePrismaObject('ContactAttachment',
      generated = generated.replace(
        "type Types = typeof builder extends PothosSchemaTypes.SchemaBuilder<infer T> ? T : unknown;",
        "export type Types = typeof builder extends PothosSchemaTypes.SchemaBuilder<infer T> ? T : unknown;"
      );

      const regex = /export const (\w+)Object = definePrismaObject\('(\w+)',/g;
      const match = regex.exec(generated);
      if (match && match.length > 1) {
        generated = generated.replace(
          `export const ${match[1]}Object = definePrismaObject('${match[1]}'`,
          `import { InterfaceParam } from "@pothos/core";
import { PrismaObjectTypeOptions } from "@pothos/plugin-prisma";
import { Types } from "../utils";

export const ${match[1]}Object: PrismaObjectTypeOptions<
  Types,
  Types["PrismaTypes"]["${match[1]}"],
  InterfaceParam<Types>[],
  any,
  Types["PrismaTypes"]["${match[1]}"]["Include"],
  Types["PrismaTypes"]["${match[1]}"]["Select"],
  Types["PrismaTypes"]["${match[1]}"]["Shape"]
> = definePrismaObject("${match[1]}"`
        );
      }

      return generated
        .replace(
          "resolve: async (query, _root, args, _context, _info)",
          "resolve: async (query, _root, args: any, _context, _info)"
        )
        .replace(
          "resolve: async (_root, args, _context, _info)",
          "resolve: async (_root, args: any, _context, _info)"
        )
        .replace("query: undefined,", "")
        .replace("query: (args) =>", "query: (args: any) =>");
    },
  },
  inputs: {
    builderImporter: "import { builder } from '../../builder';",
    prismaImporter: `import { Prisma } from '@prisma/client/contact';`,
    outputFilePath: "./src/__generated__/crud/inputs.ts",
  },
  global: {},
};
