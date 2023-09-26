import { ExecutorContext } from "@nx/devkit";
import { executeAsync, findFileName } from "@stormstack/core-server-utilities";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import doctoc from "doctoc";
import fs from "fs";
import { existsSync, readFileSync, writeFileSync } from "fs-extra";
import Path from "path";
import { ReadMeFormatExecutorSchema } from "./schema";

export default async function (
  options: ReadMeFormatExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Executing ReadMe Formatting executor...");
    const { outputPath, templatePath, inputFile, clean } = options;

    const projectRoot = context.workspace.projects[context.projectName].root;

    if (!existsSync(templatePath)) {
      ConsoleLogger.error(
        `Cannot find the template path${
          templatePath ? ` at ${templatePath}` : ""
        }`
      );
      return { success: false };
    }

    let readMeFilePath = inputFile;
    if (!existsSync(readMeFilePath)) {
      readMeFilePath = Path.join(projectRoot, "README.md");
      if (!existsSync(readMeFilePath)) {
        ConsoleLogger.error(
          `Cannot fine the readme file at ${readMeFilePath} ${
            inputFile ? `or ${inputFile}` : ""
          }`
        );
        return { success: false };
      }
    }

    const outputFilePath = Path.join(outputPath, findFileName(readMeFilePath));

    if (clean && existsSync(outputFilePath)) {
      if (outputFilePath === readMeFilePath) {
        ConsoleLogger.warn(
          "Skipping cleaning since output directory + file name is the same as input directory + file name."
        );
      } else {
        ConsoleLogger.info(
          "Cleaning output directory (set `clean` parameter to false to skip)..."
        );
        result = await executeAsync(`rmdir /S /Q "${outputFilePath}" `);
        if (result) {
          ConsoleLogger.error(result);
          return { success: false };
        }
      }
    }

    let newContent = fs
      .readdirSync(templatePath)
      .reduce((ret: string, fileName: string) => {
        ConsoleLogger.info(`Using template "${fileName}" to format file...`);
        return formatReadMe(Path.join(templatePath, fileName), ret);
      }, readFileSync(readMeFilePath, "utf8"));

    ConsoleLogger.info("Formatting Table of Contents...");
    const toc = doctoc.transform(
      newContent,
      "github.com",
      3,
      "**Table of Contents**",
      false,
      "-",
      true,
      false
    );
    console.log(toc);
    if (!toc.transformed) {
      ConsoleLogger.warn("Table of Contents not found. Skipping...");
    }

    const packageJsonPath = Path.join(projectRoot, "package.json");
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(
        readFileSync(packageJsonPath, "utf8") ?? "{}"
      );
      if (packageJson?.version) {
        ConsoleLogger.info("Adding version...");
        newContent = newContent.replace(
          "<!-- VERSION -->",
          packageJson.version
        );
      }
    }

    ConsoleLogger.info(`Writing output markdown to "${outputFilePath}"`);
    writeFileSync(
      outputFilePath,
      toc.transformed
        ? formatReadMeFromSectionName("doctoc", toc.toc, newContent)
        : newContent,
      "utf8"
    );

    ConsoleLogger.success(
      `ReadMe Formatting successfully ran for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred executing ReadMe Formatting for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}

const formatReadMe = (templatePath: string, readMeContent: string): string => {
  const templateContent = readFileSync(templatePath, "utf8");

  const section = findFileName(templatePath)
    .replace(templatePath, "")
    .replace("README.", "")
    .replace(".md", "");
  return formatReadMeFromSectionName(section, templateContent, readMeContent);
};

const formatReadMeFromSectionName = (
  sectionName: string,
  templateContent: string,
  readMeContent: string,
  skipLint = true
): string => {
  const { regex, start, end } = createRegExp(sectionName);
  if (!regex.test(readMeContent)) {
    ConsoleLogger.warn(
      `Contents do not contain start/end comments for section "${sectionName}".
Start: "${start}"
End: "${end}"
Regex: "${regex}"
Content: "${readMeContent}"`
    );
    return readMeContent;
  }

  return readMeContent.replace(
    regex,
    `${start}
${
  skipLint
    ? "<!-- prettier-ignore-start -->\n" + "<!-- markdownlint-disable -->\n"
    : ""
}

${templateContent}

${
  skipLint
    ? "<!-- markdownlint-restore -->\n" + "<!-- prettier-ignore-end -->\n"
    : ""
}
${end}`
  );
};

const createRegExp = (sectionName: string) => {
  const start = `<!-- START ${sectionName} -->`;
  const end = `<!-- END ${sectionName} -->`;
  const regex = new RegExp(`${start}([\\s\\S]*?)${end}`);
  return { regex, start, end };
};
