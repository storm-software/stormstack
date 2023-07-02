/* eslint-disable @typescript-eslint/no-explicit-any */
import parserCss from "prettier/parser-postcss";
import prettier from "prettier/standalone";
import { IToken } from "../../types";
import { LibsType } from "../global-libs";
import * as TokensClass from "./tokens";

export type InputDataType = Array<
  Pick<IToken, "name" | "value" | "type"> & Record<string, any>
>;
export type OutputDataType = string;
export type ColorsFormat =
  | "rgb"
  | "prgb"
  | "hex"
  | "hex6"
  | "hex3"
  | "hex4"
  | "hex8"
  | "name"
  | "hsl"
  | "hsv";
export type OptionsType =
  | Partial<{
      formatName: "camelCase" | "kebabCase" | "snakeCase" | "pascalCase";
      formatTokens: Partial<{
        color: ColorsFormat;
      }>;
      formatConfig: Partial<{
        selector: string;
        endOfLine: "auto" | "lf" | "crlf" | "cr";
        tabWidth: number;
        useTabs: boolean;
      }>;
    }>
  | undefined;

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, "_">
): Promise<OutputDataType> {
  const transformNameFn = _[options?.formatName || "kebabCase"];
  const selector = options?.formatConfig?.selector || ":root";
  const tokensGroupByType = _.groupBy(tokens, "type");
  const styles = Object.keys(tokensGroupByType).reduce(
    (result: any, type: any) => {
      const formattedCss = tokensGroupByType[type]
        .map((token: any) => {
          if (
            !(<any>TokensClass)[
              `${token.type.charAt(0).toUpperCase() + token.type.slice(1)}`
            ]
          ) {
            return undefined;
          }
          const instance = new (<any>TokensClass)[
            `${token.type.charAt(0).toUpperCase() + token.type.slice(1)}`
          ](token);

          const name =
            options?.formatName ||
            token.name.includes(" ") ||
            token.name.includes("\n") ||
            token.name.includes("/")
              ? transformNameFn(token.name)
              : token.name;
          return `--${name}: ${instance.toCss(options)};`;
        })
        .join("");
      if (formattedCss.length > 0)
        result += `\n\n/* ${type.toUpperCase()} */\n${formattedCss}`;
      return result;
    },
    ""
  );
  return prettier.format(`${selector} {${styles}}`, {
    ...options?.formatConfig,
    parser: "css",
    plugins: [parserCss],
  });
}
