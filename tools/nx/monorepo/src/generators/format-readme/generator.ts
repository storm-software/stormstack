import {
  ProjectConfiguration,
  Tree,
  getProjects,
  joinPathFragments
} from "@nx/devkit";
import { execute } from "@stormstack/core-server-utilities/execute";
import {
  findFileName,
  findFilePath
} from "@stormstack/core-server-utilities/file-path-fns";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import prettierConfig from "@stormstack/tools-devops-config/prettier";
import { existsSync, readdirSync } from "fs";
import { Options, format } from "prettier";
import {
  createTokens,
  formatReadMeFromSectionName
} from "../../utilities/readme-format-utilities";
import { ReadMeFormatGeneratorSchema } from "./schema";

export default async function (
  tree: Tree,
  options?: ReadMeFormatGeneratorSchema
) {
  try {
    ConsoleLogger.showTitle();
    ConsoleLogger.info("Running 📓 ReadMe Format Executor...");
    ConsoleLogger.info(`Current Working Dir: ${process.cwd()}`);
    const { outputPath, templatePath, clean, prettier } = options;

    if (!existsSync(templatePath)) {
      ConsoleLogger.error(
        `Cannot find the template path${
          templatePath ? ` at ${templatePath}` : ""
        }`
      );
      return;
    }

    getProjects(tree).forEach(
      (project: ProjectConfiguration, projectName: string) => {
        const inputFile = joinPathFragments(project.root, "README.md");
        if (tree.exists(inputFile)) {
          ConsoleLogger.info(`Formatting README file at "${inputFile}"`);
          if (!tree.exists(inputFile)) {
            ConsoleLogger.warn(`Cannot find the input file at ${inputFile}`);
          } else {
            const outputFilePath = outputPath
              ? outputPath.includes("README.md")
                ? outputPath
                : joinPathFragments(findFilePath(outputPath), "README.md")
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
                tree.delete(outputFilePath);
              }
            }

            let newContent = readdirSync(templatePath).reduce(
              (ret: string, fileName: string) => {
                ConsoleLogger.info(
                  `Using template "${fileName}" to format file...`
                );

                const templateFilePath = joinPathFragments(
                  templatePath,
                  fileName
                );
                const templateContent = tree.read(templateFilePath, "utf8");

                const section = findFileName(templateFilePath)
                  .replace(templatePath, "")
                  .replace("README.", "")
                  .replace(".md", "");

                return formatReadMeFromSectionName(
                  section,
                  templateContent,
                  ret
                );
              },
              tree.read(inputFile, "utf8")
            );

            const packageJsonPath = joinPathFragments(
              findFilePath(inputFile),
              "package.json"
            );
            if (tree.exists(packageJsonPath)) {
              const packageJson = JSON.parse(
                tree.read(packageJsonPath, "utf8") ?? "{}"
              );
              if (packageJson?.version) {
                ConsoleLogger.info("Adding version...");
                newContent = newContent.replace(
                  "<!-- VERSION -->",
                  packageJson.version
                );
              }
            }

            if (prettier) {
              ConsoleLogger.info(`Formatting output with Prettier`);

              newContent = format(newContent, prettierConfig as Options);
            }

            ConsoleLogger.info(
              `Writing output markdown to "${outputFilePath}"`
            );
            tree.write(outputFilePath, newContent);

            try {
              const { start, end } = createTokens("doctoc");
              if (newContent.includes(start) || newContent.includes(end)) {
                ConsoleLogger.info("Formatting Table of Contents...");

                execute(
                  `pnpm doctoc ${outputFilePath} --github --title "## Table of Contents" --maxlevel 3`
                );
              } else {
                ConsoleLogger.warn(
                  `Contents do not contain start/end comments for section "doctoc", skipping  table of contents generation...`
                );
              }
            } catch (e) {
              ConsoleLogger.warn(
                `Failed to format Table of Contents for ${outputFilePath}.`
              );
              ConsoleLogger.warn(e);
            }

            ConsoleLogger.success(
              `ReadMe Formatting successfully ran for ${projectName}.`
            );
          }
        }
      }
    );
  } catch (e) {
    ConsoleLogger.error(`An error occurred executing ReadMe Formatting`);
    ConsoleLogger.error(e);
  }
}
