import { Tree } from "@nx/devkit";
import {
  execute,
  findFileName,
  findFilePath,
} from "@open-system/core-server-utilities";
import { ConsoleLogger } from "@open-system/core-shared-utilities";
import doctoc from "doctoc";
import fs, { existsSync } from "fs";
import { readFileSync, writeFileSync } from "fs-extra";
import { glob } from "glob";
import Path from "path";
import { ReadMeFormatGeneratorSchema } from "./schema";

export default async function (
  host: Tree,
  options?: ReadMeFormatGeneratorSchema
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Executing Repo ReadMe Formatting generator...");
    const { outputPath, templatePath, inputGlob, clean } = options;

    if (!existsSync(templatePath)) {
      ConsoleLogger.error(
        `Cannot find the template path${
          templatePath ? ` at ${templatePath}` : ""
        }`
      );
      return { success: false };
    }

    const inputFiles = await glob(inputGlob, { ignore: "node_modules/**" });
    if (!inputFiles || inputFiles.length === 0) {
      ConsoleLogger.warn(`Cannot fine any README files at "${inputGlob}"`);
      return { success: true };
    }

    inputFiles.forEach(inputFile => {
      const outputFilePath = outputPath
        ? Path.join(outputPath, findFileName(inputFile))
        : inputFile;

      if (clean && existsSync(outputFilePath)) {
        if (outputFilePath === inputFile) {
          ConsoleLogger.warn(
            "Skipping cleaning since output directory + file name is the same as input directory + file name."
          );
        } else {
          ConsoleLogger.info(
            "Cleaning output directory (set `clean` parameter to false to skip)..."
          );
          result = execute(`rmdir /S /Q "${outputFilePath}" `);
          if (result) {
            ConsoleLogger.error(result);
            throw result;
          }
        }
      }

      let newContent = fs
        .readdirSync(templatePath)
        .reduce((ret: string, fileName: string) => {
          ConsoleLogger.info(`Using template "${fileName}" to format file...`);
          return formatReadMe(Path.join(templatePath, fileName), ret);
        }, readFileSync(inputFile, "utf8"));

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

      const packageJsonPath = Path.join(
        findFilePath(inputFile),
        "package.json"
      );
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
        `ReadMe Formatting successfully ran for ${inputFile}.`
      );
    });

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(`An error occurred executing ReadMe Formatting`);
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
