import { ExecutorContext } from "@nx/devkit";
import { executeAsync } from "@open-system/core-server-utilities";
import { ConsoleLogger } from "@open-system/core-shared-utilities";
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
    const { outputPath, templatePath, inputFile } = options;

    const projectRoot = context.workspace.projects[context.projectName].root;

    if (existsSync(outputPath)) {
      result = await executeAsync(`rmdir /S /Q "${outputPath}" `);
      if (result) {
        ConsoleLogger.error(result);
        return { success: false };
      }
    }

    if (!existsSync(templatePath)) {
      ConsoleLogger.error("Cannot fine the template path");
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

    const oldContent = readFileSync(readMeFilePath, "utf8");
    const newContent = fs
      .readdirSync(templatePath)
      .reduce((ret: string, fileName: string) => {
        return formatReadMe(Path.join(fileName, templatePath), ret);
      }, oldContent);

    writeFileSync(readMeFilePath, newContent, "utf8");

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

const formatReadMe = async (templatePath: string, readMeContent: string) => {
  const templateContent = readFileSync(templatePath, "utf8");

  const section = templatePath
    .split(Path.sep)
    .pop()
    .replace(templatePath, "")
    .replace("README-", "")
    .replace(".md", "");
  const { regex, start, end } = createRegExp(section);
  if (!regex.test(readMeContent)) {
    throw new Error(
      `Contents do not contain start/end comments for section "${start}" and "${end}"`
    );
  }

  const newContentsWithComments =
    templateContent.includes(start) && templateContent.includes(end)
      ? `${start}\n${templateContent}\n${end}`
      : templateContent;
  return readMeContent.replace(regex, newContentsWithComments);
};

const createRegExp = (section: string) => {
  const start = `<!--START_SECTION:${section}-->`;
  const end = `<!--END_SECTION:${section}-->`;
  const regex = new RegExp(`${start}\n(?:(?<content>[\\s\\S]+)\n)?${end}`);
  return { regex, start, end };
};
