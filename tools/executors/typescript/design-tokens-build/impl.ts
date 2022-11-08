/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext } from "@nrwl/devkit";
import fs, {
  existsSync,
  mkdirSync,
  readdir,
  readFileSync,
  writeFileSync,
} from "fs";
import Path from "path";
import SVGO from "svgo";
import {
  execute,
  printError,
  printInfo,
  printSuccess,
  svgoParser,
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
    const { tokensDir, tokensFile, fontsDir, imagesDir, clean, verbose } =
      options;

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

    const tokenJsonStr = readFileSync(tokenJson, "utf-8");
    verbose && printInfo(tokenJsonStr);

    const dataArray = JSON.parse(tokenJsonStr);
    verbose && printInfo(JSON.stringify(dataArray, null, 2));

    printInfo("Building latest design tokens...");

    (dataArray["color"] ||
      dataArray["font"] ||
      dataArray["spacing"] ||
      dataArray["gradient"]) &&
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
                  printInfo("Building color design tokens...");

                  if (name && token.value) {
                    ret.push({
                      id: name,
                      type: "color",
                      name,
                      ...token,
                    });

                    verbose &&
                      printInfo(
                        JSON.stringify(
                          {
                            id: name,
                            type: "color",
                            name,
                            ...token,
                          },
                          null,
                          2
                        )
                      );
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
                  printInfo("Building font design tokens...");

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
                    verbose && printInfo(JSON.stringify(item, null, 2));
                  }

                  return ret;
                },
                []
              )
            : []),
          ...(dataArray["spacing"]
            ? Object.entries(dataArray["spacing"]).reduce(
                (
                  ret: ToTailwindInputDataType,
                  [name, token]: [name: string, token: any]
                ) => {
                  printInfo("Building spacing design tokens...");

                  if (name && token.value) {
                    const item = {
                      id: name,
                      name,
                      ...token,
                      type: "measurement",
                    };

                    ret.push(item);
                    verbose && printInfo(JSON.stringify(item, null, 2));
                  }

                  return ret;
                },
                []
              )
            : []),
          ...(dataArray["gradient"]
            ? Object.entries(dataArray["gradient"]).reduce(
                (
                  ret: ToTailwindInputDataType,
                  [name, token]: [name: string, token: any]
                ) => {
                  printInfo("Building gradient design tokens...");

                  if (name && token.value) {
                    Object.entries(dataArray[name]).forEach(
                      ([child, gradient]: [child: string, gradient: any]) => {
                        if (child && gradient?.stops) {
                          const item = {
                            ...token,
                            ...gradient,
                            id: `${name}-${child}`,
                            name: `${name}-${child}`,
                            type: "gradient",
                            value: {
                              colors: gradient.stops,
                            },
                          };

                          ret.push(item);
                          verbose && printInfo(JSON.stringify(item, null, 2));
                        }
                      }
                    );
                  }

                  return ret;
                },
                []
              )
            : []),
          ...(dataArray["effect"]
            ? Object.entries(dataArray["effect"]).reduce(
                (
                  ret: ToTailwindInputDataType,
                  [name, token]: [name: string, token: any]
                ) => {
                  printInfo("Building shadow design tokens...");

                  if (name && token.value) {
                    const item = {
                      id: name,
                      name,
                      ...token,
                      type: "shadow",
                      value: Array.isArray(token.value)
                        ? token.value.map((shadow: any) => ({
                            isInner: shadow.shadowType === "shadowType",
                            color: token.value.color,
                            radius: shadow.radius,
                            offsetX: shadow.offsetX,
                            offsetY: shadow.offsetY,
                            blur: shadow.radius,
                            spread: shadow.spread,
                          }))
                        : [
                            {
                              isInner: token.value.shadowType === "shadowType",
                              color: token.value.color,
                              radius: token.value.radius,
                              offsetX: token.value.offsetX,
                              offsetY: token.value.offsetY,
                              blur: token.value.radius,
                              spread: token.value.spread,
                            },
                          ],
                    };

                    ret.push(item);
                    verbose && printInfo(JSON.stringify(item, null, 2));
                  }

                  return ret;
                },
                []
              )
            : []),
          /*...(dataArray["size"]
            ? Object.entries(dataArray["size"]).reduce(
                (
                  ret: ToTailwindInputDataType,
                  [name, token]: [name: string, token: any]
                ) => {
                  if (name && token.value) {
                    const item = {
                      id: name,
                      name,
                      ...token,
                      type: "size",
                    };

                    ret.push(item);
                  }

                  return ret;
                },
                []
              )
            : []),*/
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

    if (!existsSync(Path.join(outputPath, "js"))) {
      mkdirSync(Path.join(outputPath, "js"), { recursive: true });
    }

    writeFileSync(Path.join(outputPath, "js", `theme.js`), result, "utf8");

    printSuccess(`Design token theme.js (tailwind import) created.`);

    const fontsPath = existsSync(Path.join(tokensDir, fontsDir))
      ? Path.join(tokensDir, fontsDir)
      : fontsDir;
    if (existsSync(fontsPath) && dataArray["font"]) {
      result = await toCssFontImportParser(
        Object.entries(dataArray["font"]).reduce(
          (
            ret: ToCssFontImportParserInputDataType,
            [name, token]: [
              name: string,
              token: ToCssFontImportParserInputDataType[0]
            ]
          ) => {
            if (name && token.value?.fontFamily) {
              ret.push({
                id: name,
                type: "font",
                name: `${token.value.fontFamily
                  .replaceAll(/[_]/g, "")
                  .replaceAll(/\s/g, "")}`,
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

      if (!existsSync(Path.join(outputPath, "css"))) {
        mkdirSync(Path.join(outputPath, "css"), { recursive: true });
      }

      writeFileSync(Path.join(outputPath, "css", `fonts.css`), result, "utf8");

      printSuccess(`Theme specific fonts (font.css) created.`);
    }

    const imagesPath = existsSync(Path.join(tokensDir, imagesDir))
      ? Path.join(tokensDir, imagesDir)
      : imagesDir;
    if (existsSync(imagesPath)) {
      printInfo(
        `Building SVG images from design system assets in ${imagesPath}...`
      );

      let fileList = [];

      readdir(imagesPath, (err: NodeJS.ErrnoException, files: string[]) => {
        verbose &&
          printInfo(`Found the following assets: ${files.join(", ")}.`);

        fileList = files.reduce((ret: string[], file: string) => {
          if (err) {
            throw err;
          }

          if (file && file.endsWith("svg")) {
            ret.push(file);
          }

          return ret;
        }, fileList);
      });

      printInfo(
        `Building SVG images for the following: ${fileList.join(", ")}.`
      );

      result = await svgoParser(
        fileList.map((file: string) => ({
          name: file,
          url: file,
          value: {
            url: file,
            type: "svg",
          },
          type: "svg",
        })),
        {
          svgo: {
            js2svg: {
              pretty: true,
            },
            plugins: [
              {
                removeDimensions: true,
              },
              {
                removeAttrs: {
                  attrs: "*:(fill|stroke)",
                },
              },
              {
                addAttributesToSVGElement: {
                  // The svg also has a focusable attribute set
                  // to false which prevents the icon itself
                  // from receiving focus in IE, because otherwise
                  // the button will have two Tab stops, which is
                  // not the expected or desired behavior.
                  attributes: [
                    'width="1em"',
                    'height="1em"',
                    'focusable="false"',
                  ],
                },
              },
            ],
          },
        },
        { SVGO } as any
      );

      verbose && printSuccess(result);

      if (!result?.value) {
        printError(`An error occurred generating SVGs`);
        return { success: false };
      }

      if (!existsSync(Path.join(outputPath, "assets", "images"))) {
        mkdirSync(Path.join(outputPath, "assets", "images"), {
          recursive: true,
        });
      }

      fs.writeFileSync(
        Path.join(result?.value, "assets", "images"),
        result,
        "utf8"
      );

      printSuccess(`Theme specific images (assets/images/*.svg) created.`);
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
