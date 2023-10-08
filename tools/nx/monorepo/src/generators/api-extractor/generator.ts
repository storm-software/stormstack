import {
  Extractor,
  ExtractorConfig,
  ExtractorResult
} from "@microsoft/api-extractor";
import {
  ProjectConfiguration,
  Tree,
  getProjects,
  joinPathFragments
} from "@nx/devkit";
import { executeAsync } from "@stormstack/core-server-utilities";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { createReadStream, readdir } from "fs";
import { existsSync, mkdir, writeFile } from "fs-extra";
import Path from "path";
import { parallel } from "radash";
import { createInterface } from "readline";
import { ApiExtractorGeneratorSchema } from "./schema";

const LIB_GENERATED_DIR = "__docs__";

export default async function (
  tree: Tree,
  options?: ApiExtractorGeneratorSchema
): Promise<void> {
  try {
    ConsoleLogger.showTitle();
    ConsoleLogger.info("Running 📓 API-Extractor Generator...");
    const { outputPath, configPath, clean } = options;

    if (!existsSync(configPath)) {
      ConsoleLogger.error(
        `Cannot find the api-extractor.json config path${
          configPath ? ` at ${configPath}` : ""
        }`
      );
      return;
    }

    if (!existsSync(outputPath)) {
      mkdir(outputPath);
    } else if (clean) {
      const result = await executeAsync(
        `rimraf dist/design-system/components/stencil/dist/collection`
      );
      if (result) {
        ConsoleLogger.error(result);
        return;
      }
    }

    await parallel(
      5,
      Array.from(getProjects(tree).entries()),
      async (packageItem: [string, ProjectConfiguration]) => {
        const projectName: string = packageItem[0];
        const project: ProjectConfiguration = packageItem[1];

        if (
          !projectName.startsWith("docs") &&
          Array.isArray(project.targets[projectName].outputs) &&
          project.targets[projectName].outputs.length > 0
        ) {
          const inputFile = joinPathFragments(
            tree.root,
            project.targets[projectName].outputs[0]
          );
          if (tree.exists(inputFile)) {
            let result;

            ConsoleLogger.info(`Begin documenting ${projectName}`);

            const rootPath = tree.root;
            const docsPath = Path.join(rootPath, "docs", "ts-docs");

            const packagePath = Path.join(rootPath, project.root);
            const distPath = Path.join(rootPath, "dist", project.root);

            ConsoleLogger.info(`Processing project at path ${packagePath}`);

            ConsoleLogger.info("Navigate to root directory.");
            result = await executeAsync(` cd "${rootPath}" `);

            ConsoleLogger.info(`Building project "${projectName}"...`);
            result = await executeAsync(` npx nx run ${projectName}:build `);
            if (result) {
              ConsoleLogger.info(`Error building project "${projectName}"...`);
              ConsoleLogger.error(result);
              return;
            }
            ConsoleLogger.info("Build succeeded.");

            if (existsSync(Path.join(packagePath, "tsconfig.json"))) {
              const input = createReadStream(
                Path.join(packagePath, "tsconfig.json")
              );
              const output = [];
              const lines = createInterface({
                input,
                crlfDelay: Infinity
              });

              lines.on("line", line => {
                output.push(
                  line.includes('"../') ? line.replace('"../', '"../../') : line
                );
              });

              await new Promise(resolve => lines.once("close", resolve));
              input.close();

              await writeFile(
                Path.join(distPath, "tsconfig.json"),
                output.join("\n")
              );
            }

            ConsoleLogger.info(
              `Creating generated directory - "${Path.join(
                distPath,
                LIB_GENERATED_DIR
              )}".`
            );
            result = await executeAsync(
              ` mkdir "${Path.join(distPath, LIB_GENERATED_DIR)}" `
            );
            if (result) {
              ConsoleLogger.error(result);
              return;
            }
            ConsoleLogger.info("Directory successfully created.");

            ConsoleLogger.info(
              `Creating generated directory - "${Path.join(
                distPath,
                LIB_GENERATED_DIR,
                "reports"
              )}".`
            );
            result = await executeAsync(
              ` mkdir "${Path.join(distPath, LIB_GENERATED_DIR, "reports")}" `
            );
            if (result) {
              ConsoleLogger.error(result);
              return;
            }
            ConsoleLogger.info("Directory successfully created.");

            // Invoke API Extractor
            const extractorResult: ExtractorResult = Extractor.invoke(
              ExtractorConfig.prepare({
                configObject: ExtractorConfig.loadFile("./api-extractor.json"),
                configObjectFullPath: "./api-extractor.json",
                projectFolderLookupToken: distPath,
                packageJsonFullPath: Path.join(distPath, "package.json")
              }),
              {
                // Equivalent to the "--local" command-line parameter
                localBuild: true,

                // Equivalent to the "--verbose" command-line parameter
                showVerboseMessages: true
              }
            );
            if (!extractorResult.succeeded) {
              ConsoleLogger.error(
                `API Extractor completed with ${extractorResult.errorCount} errors` +
                  ` and ${extractorResult.warningCount} warnings`
              );

              return;
            }

            ConsoleLogger.info("Navigate to dist directory.");
            result = await executeAsync(` cd "${distPath}" `);

            result = await executeAsync(
              ` npx api-documenter markdown -i "${Path.join(
                distPath,
                LIB_GENERATED_DIR
              )}" -o "${Path.join(distPath, LIB_GENERATED_DIR, "api")}" `
            );
            if (result) {
              ConsoleLogger.error(result);
              return;
            }

            ConsoleLogger.info("Generated markdown.");
            readdir(
              Path.join(distPath, LIB_GENERATED_DIR, "api"),
              async (err: NodeJS.ErrnoException, files: string[]) => {
                !files || !Array.isArray(files) || files.length === 0
                  ? ConsoleLogger.info("No markdown doc files read")
                  : ConsoleLogger.info("Formatting markdown doc files");
                for (const docFile of files) {
                  try {
                    const { name: id, ext } = Path.parse(docFile);
                    if (ext !== ".md") {
                      continue;
                    }

                    const docPath = Path.join(
                      Path.join(distPath, LIB_GENERATED_DIR, "api"),
                      docFile
                    );
                    const input = createReadStream(docPath);
                    const output = [];
                    const lines = createInterface({
                      input,
                      crlfDelay: Infinity
                    });

                    let title = "";
                    lines.on("line", line => {
                      let skip = false;
                      if (!title) {
                        const titleLine = line.match(/## (.*)/);
                        if (titleLine) {
                          title = titleLine[1];
                        }
                      }
                      const homeLink = line.match(
                        /\[Home\]\(.\/index\.md\) &gt; (.*)/
                      );
                      if (homeLink) {
                        // Skip the breadcrumb for the toplevel index file.
                        if (id !== "stormstack") {
                          output.push(homeLink[1]);
                        }
                        skip = true;
                      }
                      // See issue #4. api-documenter expects \| to escape table
                      // column delimiters, but docusaurus uses a markdown processor
                      // that doesn't support this. Replace with an escape sequence
                      // that renders |.
                      if (line.startsWith("|")) {
                        line = line.replace(/\\\|/g, "&#124;");
                      }
                      if (!skip) {
                        output.push(line);
                      }
                    });

                    new Promise(resolve => lines.once("close", resolve)).then(
                      () => {
                        input.close();

                        const header = [
                          "---",
                          `id: ${id}`,
                          `title: ${title}`,
                          `hide_title: true`,
                          "---"
                        ];

                        writeFile(
                          Path.join(docsPath, projectName),
                          header.concat(output).join("\n")
                        );
                      }
                    );
                  } catch (err) {
                    ConsoleLogger.error(`Could not process ${docFile}: ${err}`);
                  }
                }
              }
            );

            ConsoleLogger.info(
              `Documents successfully generated for ${projectName}!`
            );
          }
        }
      }
    );

    /* ConsoleLogger.info(` xcopy "${fromPath}" "${toPath}" `);
          result = await execute(` xcopy "${fromPath}" "${toPath}" `);
          if (result) {
            ConsoleLogger.error(result);

            return { success: false };
          }


       result = await execute(
          ` xcopy "${Path.join(
            packagePath,
            LIB_DOCS_DIR,
            "api"
          )}" "${docsPath}" /O /X /E /H /K `
        );
        if (result) {
          ConsoleLogger.error(result);

          return { success: false };
        }*/

    ConsoleLogger.success(
      "Successfully completed generating API documentation"
    );
  } catch (e) {
    ConsoleLogger.error("An error occurred generating API documentation");
    ConsoleLogger.error(e);
  }
}
