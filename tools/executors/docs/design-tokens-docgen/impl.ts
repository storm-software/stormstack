import { ExecutorContext } from "@nrwl/devkit";
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import Path from "path";
import prettier from "prettier";
import { printError, printInfo, printSuccess } from "../utilities";
import { DesignTokensDocGenExecutorSchema } from "./schema";

export default async function (
  options: DesignTokensDocGenExecutorSchema,
  context: ExecutorContext
) {
  try {
    printInfo("Executing design-tokens-docgen executor...");
    printInfo(`Options: ${JSON.stringify(options, null, 2)}`);
    printInfo(`Current Directory: ${__dirname}`);

    const tokensPath = Path.join(context.root, options.tokensPath);
    const outputPath = Path.join(context.root, options.outputPath);

    printInfo(`Design tokens location: ${tokensPath}`);

    if (!existsSync(tokensPath)) {
      printError(`Design tokens directory "${tokensPath}" does not exist`);
      return { success: false };
    }

    printInfo("Documenting design tokens code...");

    readdirSync(tokensPath).forEach(file => {
      const filePath = Path.join(tokensPath, file);
      printInfo(filePath);

      if (!lstatSync(filePath).isDirectory()) {
        const contents = readFileSync(filePath, "utf-8");

        const colorTokens = [];
        const fontFamilyTokens = [];
        const fontSizeTokens = [];
        const fontWeightTokens = [];
        const spacingTokens = [];
        const paddingTokens = [];
        const marginTokens = [];
        const gapTokens = [];

        const miscTokens =
          contents
            ?.match(/--.+: .+(?=;)/gm)
            ?.reduce((ret: string[], variable: string) => {
              const [key, value] = variable.split(":");

              if (key?.includes("color")) {
                colorTokens.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              } else if (key?.includes("font-family")) {
                fontFamilyTokens.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              } else if (key?.includes("font-size")) {
                fontSizeTokens.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              } else if (key?.includes("font-weight")) {
                fontWeightTokens.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              } else if (key?.includes("spacing")) {
                spacingTokens.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              } else if (key?.includes("padding")) {
                paddingTokens.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              } else if (key?.includes("margin")) {
                marginTokens.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              } else if (key?.includes("gap")) {
                gapTokens.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              } else {
                ret.push(
                  `| ${key.trim()} | ${value.trim()} | <DisplayDesignToken token="${key.trim()}" value="${value.trim()}" /> |`
                );
              }

              return ret;
            }, []) ?? [];

        writeFileSync(
          outputPath,
          prettier.format(
            `
import { DisplayDesignToken } from "./DisplayDesignToken/DisplayDesignToken";

${
  colorTokens.length > 0
    ? `## Color
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${colorTokens.join("\n")}`
    : ""
}

${
  fontFamilyTokens.length > 0
    ? `## Font Family
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${fontFamilyTokens.join("\n")}`
    : ""
}

${
  fontSizeTokens.length > 0
    ? `## Font Size
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${fontSizeTokens.join("\n")}`
    : ""
}

${
  fontWeightTokens.length > 0
    ? `## Font Weight
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${fontWeightTokens.join("\n")}`
    : ""
}

${
  spacingTokens.length > 0
    ? `## Spacing
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${spacingTokens.join("\n")}`
    : ""
}

${
  paddingTokens.length > 0
    ? `## Padding
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${paddingTokens.join("\n")}`
    : ""
}

${
  marginTokens.length > 0
    ? `## Margin
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${marginTokens.join("\n")}`
    : ""
}

${
  gapTokens.length > 0
    ? `## Gap
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${gapTokens.join("\n")}`
    : ""
}

${
  miscTokens.length > 0
    ? `## Miscellaneous
    | Token     | Value     |
    | :-------: | :-------: |
${miscTokens.join("\n")}`
    : ""
}



                `,
            {
              parser: "markdown",
            }
          )
        );
      }
    });

    printSuccess("Design tokens documentation successfully created.");

    return { success: true };
  } catch (e) {
    printError(
      `An error occurred documenting design tokens for ${context.projectName}`
    );
    printError(e);

    return { success: false };
  }
}
