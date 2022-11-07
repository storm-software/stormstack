/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext } from "@nrwl/devkit";
import fs from "fs";
import Path from "path";
import {
  execute,
  printError,
  printInfo,
  printSuccess,
  toCssFontImportParser,
  toTailwindParser,
} from "../utilities";
import { InputDataType as ToCssFontImportParserInputDataType } from "../utilities/design-token-parsers/parsers/to-css-font-import";
import { InputDataType as ToTailwindInputDataType } from "../utilities/design-token-parsers/parsers/to-tailwind";
import { IToken } from "../utilities/design-token-parsers/types";
import { DesignTokensBuildExecutorSchema } from "./schema";

export default async function (
  options: DesignTokensBuildExecutorSchema,
  context: ExecutorContext
) {
  try {
    const { tokensDir, tokensFile, fontsDir, clean, verbose } = options;

    printInfo("Executing design-tokens-build executor...");
    verbose && printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    verbose && printInfo(`Current Directory: ${__dirname}`);

    const themeName = context.configurationName
      ? context.configurationName
      : "default";

    const tokenJson = Path.join(tokensDir, tokensFile);
    if (!tokenJson) {
      printError(
        `No JSON file could be found at ${tokenJson}. Halting execution early.`
      );
      return { success: false };
    }

    const outputPath =
      context.workspace?.projects?.[context.projectName]?.targets?.["build"]
        ?.options?.outputPath;
    if (!outputPath) {
      printError(
        "No `outputPath` option was provided. Halting execution early."
      );
      return { success: false };
    }

    printInfo(`Design Tokens JSON: ${tokensDir}`);
    printInfo("Starting design tokens build...");

    let result;
    if (clean) {
      printInfo("Cleaning previous design tokens build...");

      result = await execute(
        `rimraf ./dist/design-system/tokens -v !("package.json")`
      );
      if (result) {
        printError(result);
        return { success: false };
      }
    }

    verbose && printInfo(`Loading design tokens file for theme: ${themeName}`);

    const tokenJsonStr = fs.readFileSync(tokenJson, "utf-8");
    verbose && printInfo(tokenJsonStr);

    const dataArray = JSON.parse(tokenJsonStr);
    verbose && printInfo(JSON.stringify(dataArray, null, 2));

    printInfo("Building latest design tokens...");

    (dataArray["color"] || dataArray["font"]) &&
      (result = await toTailwindParser(
        [
          ...(dataArray["color"]
            ? Object.entries(dataArray["color"]).reduce(
                (
                  ret: ToTailwindInputDataType,
                  [name, token]: [
                    name: string,
                    token: Omit<IToken, "id" | "type" | "name"> &
                      Partial<IToken>
                  ]
                ) => {
                  if (name && token.value) {
                    ret.push({
                      id: name,
                      type: "color",
                      name,
                      ...token,
                    });
                  }

                  return ret;
                },
                []
              )
            : []),
          ...(dataArray["font"]
            ? Object.entries(dataArray["font"]).reduce(
                (
                  ret: ToTailwindInputDataType,
                  [name, token]: [name: string, token: any]
                ) => {
                  if (name && token.value) {
                    const item = {
                      id: name,
                      name,
                      ...token,
                      type: "textStyle",
                      value: {
                        font: {
                          name: token.value?.fontFamily
                            ?.replaceAll(/[_]/g, "")
                            ?.replaceAll(/\s/g, ""),
                          value: {
                            ...token.value,
                          },
                        },
                      },
                    };

                    ret.push(item);
                  }

                  return ret;
                },
                []
              )
            : []),
        ],
        {
          formatName: "kebabCase",
          formatConfig: {
            objectName: "extend",
            exportDefault: true,
            module: "commonjs",
          },
        },
        { _: null }
      ));

    verbose && printSuccess(result);

    if (!fs.existsSync(Path.join(outputPath, "js"))) {
      fs.mkdirSync(Path.join(outputPath, "js"), { recursive: true });
    }

    fs.writeFileSync(Path.join(outputPath, "js", `theme.js`), result, "utf8");

    printSuccess(`Design token theme.js (tailwind import) created.`);

    const fontsPath = fs.existsSync(Path.join(tokensDir, fontsDir))
      ? Path.join(tokensDir, fontsDir)
      : fontsDir;
    if (fs.existsSync(fontsPath) && dataArray["font"]) {
      result = await toCssFontImportParser(
        Object.entries(dataArray["font"]).reduce(
          (
            ret: ToCssFontImportParserInputDataType,
            [name, token]: [
              name: string,
              token: ToCssFontImportParserInputDataType[0]
            ]
          ) => {
            if (name && token.value) {
              ret.push({
                id: name,
                type: "font",
                name: token.value.fontFamily
                  .replaceAll(/[_]/g, "")
                  .replaceAll(/\s/g, ""),
                ...token,
              });
            }

            return ret;
          },
          []
        ),
        {
          fontFamilyTransform: "pascalCase",
          formats: ["ttf"],
          fontsPath,
          fontDisplay: "fallback",
          genericFamily: "sans-serif",
          includeFontWeight: true,
        }
      );

      verbose && printSuccess(result);

      if (!fs.existsSync(Path.join(outputPath, "css"))) {
        fs.mkdirSync(Path.join(outputPath, "css"), { recursive: true });
      }

      fs.writeFileSync(
        Path.join(outputPath, "css", `fonts.css`),
        result,
        "utf8"
      );

      printSuccess(`Theme specific fonts (font.css) created.`);
    }

    printSuccess("Design tokens sync succeeded.");

    return { success: true };
  } catch (e) {
    printError(
      `An error occurred syncing client API for ${context.projectName}`
    );
    printError(e);

    return { success: false };
  }
}
