import {
  ProjectConfiguration,
  Tree,
  getProjects,
  joinPathFragments,
} from "@nx/devkit";
import { findFileName } from "@open-system/core-server-utilities";
import {
  ConsoleLogger,
  isEmptyObject,
} from "@open-system/core-shared-utilities";
//import doctoc from "doctoc";
import fs, { existsSync } from "fs";
import { ReadMeFormatGeneratorSchema } from "./schema";

export default async function (
  tree: Tree,
  options?: ReadMeFormatGeneratorSchema
) {
  let result!: unknown;
  try {
    ConsoleLogger.showTitle();
    ConsoleLogger.info("Executing Repo ReadMe Formatting generator...");
    ConsoleLogger.info(`Current Working Dir: ${process.cwd()}`);
    const { outputPath, templatePath, inputGlob, clean } = options;

    if (!existsSync(templatePath)) {
      ConsoleLogger.error(
        `Cannot find the template path${
          templatePath ? ` at ${templatePath}` : ""
        }`
      );
      return { success: false };
    }

    const projects = getProjects(tree);
    if (!projects || isEmptyObject(projects)) {
      ConsoleLogger.error("Cannot find any projects in repository");
      return { success: false };
    }

    Object.entries(projects).map(
      ([projectName, project]: [string, ProjectConfiguration]) => {
        const inputFile = joinPathFragments(project.root, "README.md");
        if (tree.exists(inputFile)) {
          ConsoleLogger.info(`Formatting README file at "${inputFile}"`);
          if (!tree.exists(inputFile)) {
            ConsoleLogger.warn(`Cannot find the input file at ${inputFile}`);
          } else {
            const outputFilePath = outputPath
              ? joinPathFragments(outputPath, findFileName(inputFile))
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
                // result = execute(`rmdir /S /Q "${outputFilePath}" `);
                tree.delete(outputFilePath);
                if (result) {
                  ConsoleLogger.error(result);
                  throw result;
                }
              }
            }

            const newContent = fs
              .readdirSync(templatePath)
              .reduce((ret: string, fileName: string) => {
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
              }, tree.read(inputFile, "utf8"));

            ConsoleLogger.info("Formatting Table of Contents...");
            /*const toc = doctoc.transform(
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

      const packageJsonPath = Path.joinPathFragments(
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
      );*/

            ConsoleLogger.info(
              `Writing output markdown to "${outputFilePath}"`
            );
            tree.write(outputFilePath, newContent);

            ConsoleLogger.success(
              `ReadMe Formatting successfully ran for ${projectName}.`
            );
          }
        }
      }
    );

    return { success: true };
  } catch (e) {
    ConsoleLogger.error(`An error occurred executing ReadMe Formatting`);
    ConsoleLogger.error(e);

    return { success: false };
  }
}

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
