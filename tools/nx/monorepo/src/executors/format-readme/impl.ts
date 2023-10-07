import { ExecutorContext } from "@nx/devkit";
import { executeAsync } from "@stormstack/core-server-utilities/execute";
import { findFileName } from "@stormstack/core-server-utilities/file-path-fns";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import doctoc from "doctoc";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import Path from "path";
import {
  formatReadMe,
  formatReadMeFromSectionName
} from "../../utilities/readme-format-utilities";
import { ReadMeFormatExecutorSchema } from "./schema";

export default async function (
  options: ReadMeFormatExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Running 📓 ReadMe Format Generator...");
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

    let newContent = readdirSync(templatePath).reduce(
      (ret: string, fileName: string) => {
        ConsoleLogger.info(`Using template "${fileName}" to format file...`);
        return formatReadMe(Path.join(templatePath, fileName), ret);
      },
      readFileSync(readMeFilePath, "utf8")
    );

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
