import { ExecutorContext } from "@nrwl/devkit";
import fs from 'fs';
import Path from 'path';
import { execute, InputDataType, printError, printInfo, printSuccess, toTailwindParser } from "../utilities";
import { toCssFontImportParser } from "../utilities/design-token-parsers/parsers/to-css-font-import";
import { IToken } from "../utilities/design-token-parsers/types";
import { DesignTokensBuildExecutorSchema } from "./schema";

export default async function (
  options: DesignTokensBuildExecutorSchema,
  context: ExecutorContext
) {
  try {
    printInfo("Executing design-tokens-build executor...");
    printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    printInfo(`Current Directory: ${__dirname}`);

    const { tokensDir, tokensFile, fontsDir, imagesDir, clean } = options;
    const tokenJson = Path.join(tokensDir, tokensFile);
    if (!tokenJson) {
      printError(`No JSON file could be found at ${tokenJson}. Halting execution early.`);
      return { success: false };
    }

    const outputPath = context.workspace?.projects?.[context.projectName]?.targets?.["build"]?.options?.outputPath;
    if (!outputPath) {
      printError("No `outputPath` option was provided. Halting execution early.");
      return { success: false };
    }

    printInfo(`Design Tokens JSON: ${tokensDir}`);

    printInfo("Starting design tokens build...");

    let result;
    if (clean) {
      printInfo("Cleaning previous design tokens build...");

      result = await execute(`rimraf ./dist/design-system/tokens -v !("package.json")`);
      if (result) {
        printError(result);
        return { success: false };
      }
    }

    printInfo("Loading design tokens file...");

    const tokenJsonStr = fs.readFileSync(tokenJson, 'utf-8');
    printInfo(tokenJsonStr);

    const dataArray = JSON.parse(tokenJsonStr);
    printInfo(JSON.stringify(dataArray, null, 2));

    printInfo("Building latest design tokens...");

    dataArray["color"] &&
    (result = await toTailwindParser(
      Object.entries(dataArray["color"]).reduce((ret: InputDataType,
        [name, token]: [name: string, token: Omit<IToken, "id" | "type" | "name"> & Partial<IToken>]) => {

      if (name && token.value) {
        ret.push({
          id: name,
          type: "color",
          name,
          ...token,
        });
      }

      return ret;
    }, []), {
      formatName: 'camelCase',
      formatConfig: {
        objectName: 'extend',
        exportDefault: true,
        module: 'commonjs',
      },
    }, { _: null }));

    printSuccess(result);
    printSuccess("Design tokens sync succeeded.");

    fs.writeFileSync(Path.join(outputPath, "js", `${
      context.configurationName
        ? context.configurationName
        : "default"
      }.theme.js`),
      result,
      'utf8');

    const fontsPath = fs.existsSync(Path.relative(tokensDir, fontsDir))
      ? Path.relative(tokensDir, fontsDir)
      : fontsDir;

    fs.existsSync(fontsPath) &&
    dataArray["font"] &&
    (result = await toCssFontImportParser(
      Object.entries(dataArray["font"]).reduce((ret: InputDataType,
        [name, token]: [name: string, token: Omit<IToken, "id" | "type" | "name"> & Partial<IToken>]) => {

      if (name && token.value) {
        ret.push({
          id: name,
          type: "font",
          name,
          ...token,
        });
      }

      return ret;
    }, []), {
      fontFamilyTransform: "pascalCase",
      formats: ["ttf", "otf"],
      fontsPath,
      fontDisplay: "fallback",
      genericFamily: "sans-serif",
      includeFontWeight: true,
    }));

    fs.writeFileSync(Path.join(outputPath, "css", `${
      context.configurationName
        ? context.configurationName
        : "default"
      }.fonts.css`),
      result,
      'utf8');

    return { success: true };
  } catch (e) {
    printError(
      `An error occurred syncing client API for ${context.projectName}`
    );
    printError(e);

    return { success: false };
  }
}

const fontRules = [
  {
    name: 'Design Tokens / CSS font imports',
    path: `${designTokensFolderPath}/fonts.css`,
    filter: {
      types: ['font'],
    },
    parsers: [
      {
        name: 'to-css-font-import',
        options: {
          formats: fontFormats,
          fontsPath: path.relative(designTokensFolderPath, fontsFolderPath),
        },
      },
    ],
  },
  {
    name: 'Design Tokens / Export fonts',
    path: fontsFolderPath,
    filter: {
      types: ['font'],
    },
    parsers: [
      {
        name: 'convert-font',
        options: {
          formats: fontFormats,
        },
      },
    ],
  },
];
