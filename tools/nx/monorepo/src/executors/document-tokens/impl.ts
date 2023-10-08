import { ExecutorContext } from "@nx/devkit";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from "fs";
import Path from "path";
import prettier from "prettier";
import { DocumentTokensExecutorSchema } from "./schema";

export default async function (
  options: DocumentTokensExecutorSchema,
  context: ExecutorContext
) {
  try {
    ConsoleLogger.info("Creating 📱 Design Token Documentation...");
    const tokensPath = Path.join(context.root, options.tokensPath);
    const outputPath = Path.join(context.root, options.outputPath);

    ConsoleLogger.info(`Design tokens location: ${tokensPath}`);

    if (!existsSync(tokensPath)) {
      ConsoleLogger.error(
        `Design tokens directory "${tokensPath}" does not exist`
      );
      return { success: false };
    }

    ConsoleLogger.info("Documenting design tokens code...");

    readdirSync(tokensPath).forEach(file => {
      const filePath = Path.join(tokensPath, file);
      ConsoleLogger.info(filePath);

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
    ? `## Color {#color}
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${colorTokens.join("\n")}`
    : ""
}

${
  fontFamilyTokens.length > 0
    ? `## Font Family {#font-family}
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${fontFamilyTokens.join("\n")}`
    : ""
}

${
  fontSizeTokens.length > 0
    ? `## Font Size {#font-size}
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${fontSizeTokens.join("\n")}`
    : ""
}

${
  fontWeightTokens.length > 0
    ? `## Font Weight {#font-weight}
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${fontWeightTokens.join("\n")}`
    : ""
}

${
  spacingTokens.length > 0
    ? `## Spacing {#spacing}
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${spacingTokens.join("\n")}`
    : ""
}

${
  paddingTokens.length > 0
    ? `## Padding {#padding}
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${paddingTokens.join("\n")}`
    : ""
}

${
  marginTokens.length > 0
    ? `## Margin {#margin}
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${marginTokens.join("\n")}`
    : ""
}

${
  gapTokens.length > 0
    ? `## Gap {#gap}
| Token     | Value     | Display     |
| :-------: | :-------: |:----------: |
${gapTokens.join("\n")}`
    : ""
}

${
  miscTokens.length > 0
    ? `## Miscellaneous {#miscellaneous}
    | Token     | Value     |
    | :-------: | :-------: |
${miscTokens.join("\n")}`
    : ""
}                `,
            {
              parser: "markdown"
            }
          )
        );
      }
    });

    ConsoleLogger.success(
      "📱 Design tokens documentation successfully created."
    );

    return { success: true };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred documenting design tokens for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
