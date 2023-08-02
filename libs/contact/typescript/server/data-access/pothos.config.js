/** @type {import('prisma-generator-pothos-codegen').Config} */
module.exports = {
  inputs: {
    // builderImporter: "import { builder } from '../builder';",
    prismaImporter: `import { prisma } from '../prisma';`,
    outputFilePath: "./src/__generated__/crud/inputs.ts",
  },
  crud: {
    outputDir: "./src/__generated__/crud",
    disabled: false,
    generateAutocrud: true,
    inputsImporter: "import * as Inputs from '../inputs'",
    deleteOutputDirBeforeGenerate: true,
    exportEverythingInObjectsDotTs: true,
    prismaImporter: `import { prisma } from '../prisma';`,
    prismaCaller: "client",
    resolverImports: `\nimport { client } from '../../builder';`,
  },
  global: {
    builderImporter: `import { builder } from '../../builder';`,
  },
};
