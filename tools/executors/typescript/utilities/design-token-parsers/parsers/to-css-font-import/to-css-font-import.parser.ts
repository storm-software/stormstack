import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import * as _ from "lodash";
import os from "os";
import path from "path";
import parserCss from "prettier/parser-postcss";
import prettier from "prettier/standalone";
export type InputDataType = Array<{ name: string; [Key: string]: any }>;
export type OutputDataType = string;
export type OptionsType = {
  formats?: Array<"woff2" | "woff" | "otf" | "ttf" | "eot">;
  fontsPath?: string;
  fontFamilyTransform?: "camelCase" | "kebabCase" | "snakeCase" | "pascalCase";
  includeFontWeight?: boolean;
  fontDisplay?: "auto" | "block" | "swap" | "fallback" | "optional";
  genericFamily?: "serif" | "sans-serif" | "cursive" | "fantasy" | "monospace";
};

const formatDictionary = {
  woff2: "woff2",
  woff: "woff",
  otf: "truetype",
  ttf: "truetype",
  eot: null,
};

class ToCssFont {
  tokens: InputDataType;
  formats: NonNullable<OptionsType["formats"]>;
  fontsPath: NonNullable<OptionsType["fontsPath"]>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  fontFamilyTransformFn: Function | undefined;
  includeFontWeight: OptionsType["includeFontWeight"];
  fontDisplay: NonNullable<OptionsType["fontDisplay"]>;
  genericFamily: OptionsType["genericFamily"];

  constructor(tokens: InputDataType, options: OptionsType | undefined) {
    this.tokens = tokens;
    this.formats = options?.formats || ["woff2", "woff"];
    this.fontsPath = options?.fontsPath || "";
    this.fontDisplay = options?.fontDisplay || "swap";
    this.genericFamily = options?.genericFamily;
    this.includeFontWeight =
      typeof options?.includeFontWeight !== "boolean"
        ? true
        : options.includeFontWeight;
    if (options?.fontFamilyTransform)
      this.fontFamilyTransformFn = _[options?.fontFamilyTransform];
  }

  run() {
    return this.tokens
      .map(tokenFont => {
        let entry = this.appendFontFamily(tokenFont);
        entry = this.appendFormats(entry, tokenFont);
        if (this.formats?.includes("eot"))
          entry = this.appendEotFormat(entry, tokenFont);
        if (this.includeFontWeight)
          entry = this.appendFontWeight(entry, tokenFont);
        entry = this.setFontDisplay(entry, this.fontDisplay);
        return this.wrapInFontFace(entry);
      })
      .join(os.EOL + os.EOL);
  }

  formatFontUrl(fontName: string, fileType = "ttf", fontWeight?: number) {
    let fontWeightDesc = "Regular";
    if (fontWeight < 300) {
      fontWeightDesc = "Light";
    } else if (fontWeight < 600) {
      fontWeightDesc = "Regular";
    } else if (fontWeight < 700) {
      fontWeightDesc = "SemiBold";
    } else if (fontWeight < 800) {
      fontWeightDesc = "Bold";
    } else if (fontWeight < 900) {
      fontWeightDesc = "ExtraBold";
    } else {
      fontWeightDesc = "Black";
    }

    return path.join(
      this.fontsPath,
      fontName,
      `${fontName}-${fontWeightDesc}.${fileType}`
    );
  }

  appendFontFamily(token: InputDataType[0]) {
    let result = this.fontFamilyTransformFn
      ? this.fontFamilyTransformFn(token.name)
      : JSON.stringify(token.name);
    if (this.genericFamily) result += `, ${this.genericFamily}`;
    return `font-family: ${result};`;
  }

  appendEotFormat(entry: string, token: InputDataType[0]) {
    return (
      entry +
      `src: url("${this.formatFontUrl(
        token.name,
        "eot",
        token.value?.fontWeight
      )}");`
    );
  }

  appendFormats(entry: string, token: InputDataType[0]) {
    const formats = this.formats
      .reduce<Array<string>>((result, format) => {
        if (format === "eot") return result;

        result.push(
          `url("${this.formatFontUrl(
            token.name,
            format,
            token.value?.fontWeight
          )}") format("${formatDictionary[format]}")`
        );

        return result;
      }, [])
      .join(",");
    return entry + `src: ${formats};`;
  }

  appendFontWeight(entry: string, token: InputDataType[0]) {
    return token.value?.fontWeight
      ? `${entry}font-weight: ${token.value.fontWeight};`
      : entry;
  }

  setFontDisplay(entry: string, fontDisplay: OptionsType["fontDisplay"]) {
    return `${entry}font-display: ${fontDisplay};`;
  }

  wrapInFontFace(entry: string) {
    return `@font-face {${entry}}`;
  }
}

export default async function (
  tokens: InputDataType,
  options?: OptionsType
): Promise<OutputDataType | Error> {
  try {
    const toCssFont = new ToCssFont(tokens, options);
    return prettier.format(toCssFont.run(), {
      parser: "css",
      plugins: [parserCss],
    });
  } catch (err) {
    ConsoleLogger.error(err);
    throw err;
  }
}
