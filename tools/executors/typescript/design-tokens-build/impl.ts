/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext } from "@nrwl/devkit";
import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import Path from "path";
import SVGO from "svgo";
import {
  execute,
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

    ConsoleLogger.info("Executing design-tokens-build executor...");
    verbose &&
      ConsoleLogger.info(`Options: ${JSON.stringify(options, null, 2)}`);
    verbose && ConsoleLogger.info(`Current Directory: ${__dirname}`);

    const themeName = context.configurationName
      ? context.configurationName
      : "default";

    const tokenJson = Path.join(tokensDir, tokensFile);
    if (!tokenJson) {
      ConsoleLogger.error(
        `No JSON file could be found at ${tokenJson}. Halting execution early.`
      );
      return { success: false };
    }

    const outputPath =
      context.workspace?.projects?.[context.projectName]?.targets?.["build"]
        ?.options?.outputPath;
    if (!outputPath) {
      ConsoleLogger.error(
        "No `outputPath` option was provided. Halting execution early."
      );
      return { success: false };
    }

    ConsoleLogger.info(`Design Tokens JSON: ${tokensDir}`);
    ConsoleLogger.info("Starting design tokens build...");

    let result;
    if (clean) {
      ConsoleLogger.info("Cleaning previous design tokens build...");

      result = await execute(
        `rimraf ./dist/design-system/tokens -v !("package.json")`
      );
      if (result) {
        ConsoleLogger.error(result);
        return { success: false };
      }
    }

    verbose &&
      ConsoleLogger.info(`Loading design tokens file for theme: ${themeName}`);

    const tokenJsonStr = readFileSync(tokenJson, "utf-8");
    verbose && ConsoleLogger.info(tokenJsonStr);

    const dataArray = JSON.parse(tokenJsonStr);
    verbose && ConsoleLogger.info(JSON.stringify(dataArray, null, 2));

    ConsoleLogger.info("Building latest design tokens...");

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
                  ConsoleLogger.info("Building color design tokens...");

                  if (name && token.value) {
                    ret.push({
                      id: name,
                      type: "color",
                      name,
                      ...token,
                    });

                    verbose &&
                      ConsoleLogger.info(
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
                  ConsoleLogger.info("Building font design tokens...");

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
                    verbose &&
                      ConsoleLogger.info(JSON.stringify(item, null, 2));
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
                  ConsoleLogger.info("Building spacing design tokens...");

                  if (name && token.value) {
                    const item = {
                      id: name,
                      name,
                      ...token,
                      type: "measurement",
                    };

                    ret.push(item);
                    verbose &&
                      ConsoleLogger.info(JSON.stringify(item, null, 2));
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
                  ConsoleLogger.info("Building gradient design tokens...");

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
                          verbose &&
                            ConsoleLogger.info(JSON.stringify(item, null, 2));
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
                  ConsoleLogger.info("Building shadow design tokens...");

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
                    verbose &&
                      ConsoleLogger.info(JSON.stringify(item, null, 2));
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

    verbose && ConsoleLogger.success(result);

    if (!existsSync(Path.join(outputPath, "js"))) {
      ConsoleLogger.info(
        `Creating token directory: ${Path.join(outputPath, "js")}`
      );

      mkdirSync(Path.join(outputPath, "js"), { recursive: true });
    }

    ConsoleLogger.info(
      `Creating token file: ${Path.join(outputPath, "js", `theme.js`)}`
    );
    writeFileSync(Path.join(outputPath, "js", `theme.js`), result, "utf8");

    ConsoleLogger.success(`Design token theme.js (tailwind import) created.`);

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

      verbose && ConsoleLogger.success(result);

      if (!existsSync(Path.join(outputPath, "css"))) {
        mkdirSync(Path.join(outputPath, "css"), { recursive: true });
      }

      writeFileSync(Path.join(outputPath, "css", `fonts.css`), result, "utf8");

      ConsoleLogger.success(`Theme specific fonts (font.css) created.`);
    }

    const imagesPath = existsSync(Path.join(tokensDir, imagesDir))
      ? Path.join(tokensDir, imagesDir)
      : imagesDir;
    ConsoleLogger.info(`Checking for SVG images in ${imagesPath}`);
    if (existsSync(imagesPath)) {
      ConsoleLogger.info(`Building SVG images from design system assets...`);

      const fileList = readdirSync(imagesPath);
      if (fileList.length === 0) {
        ConsoleLogger.info(`No SVG images could be found in ${imagesPath}.`);
      } else {
        ConsoleLogger.info(
          `Building SVG images for the following: ${fileList.join(", ")}.`
        );

        result = await svgoParser(
          fileList.map((file: string) => ({
            name: file,
            url: Path.join(imagesDir, file),
            value: {
              url: Path.join(imagesDir, file),
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

        if (!result) {
          ConsoleLogger.error(`An error occurred generating SVGs`);
          return { success: false };
        }

        verbose && ConsoleLogger.success(JSON.stringify(result, null, 2));

        ConsoleLogger.success(
          `Theme specific images (assets/images/*.svg) created.`
        );
      }
    }

    ConsoleLogger.success("Design tokens sync succeeded.");

    return { success: true };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
