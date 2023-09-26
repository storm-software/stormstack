/*import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from "@microsoft/api-extractor";*/
import { ExecutorContext } from "@nx/devkit";
import { executeAsync } from "@stormstack/core-server-utilities";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { createReadStream, readdir } from "fs";
import { existsSync, writeFile } from "fs-extra";
import Path from "path";
import { parse } from "qs";
import { createInterface } from "readline";

const LIB_GENERATED_DIR = "__docs__";

const documentExecutor = async (
  options: Record<string, never>,
  context: ExecutorContext
) => {
  try {
    ConsoleLogger.info(`Executing "document" executor...`);
    ConsoleLogger.info(`Options: ${JSON.stringify(options, null, 2)}`);
    ConsoleLogger.info(`Current Directory: ${__dirname}`);
    ConsoleLogger.info(`context: ${JSON.stringify(context)}`);

    let result;
    for (const [key, project] of Object.entries(context.workspace.projects)) {
      if (!key.endsWith("docs")) {
        ConsoleLogger.info(`Begin documenting ${key}`);

        const rootPath = context.root;
        const docsPath = Path.join(rootPath, "docs", "ts-docs");

        const packagePath = Path.join(rootPath, project.root);
        const distPath = Path.join(rootPath, "dist", project.root);

        ConsoleLogger.info(`Processing project at path ${packagePath}`);

        ConsoleLogger.info("Navigate to root directory.");
        result = await executeAsync(` cd "${rootPath}" `);

        ConsoleLogger.info(`Building project "${key}"...`);
        result = await executeAsync(` npx nx run ${key}:build `);
        if (result) {
          ConsoleLogger.info(`Error building project "${key}"...`);

          ConsoleLogger.error(result);
          return { success: false };
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
          return { success: false };
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
          return { success: false };
        }
        ConsoleLogger.info("Directory successfully created.");

        // Invoke API Extractor
        /*const extractorResult: ExtractorResult = Extractor.invoke(
          ExtractorConfig.prepare({
            configObject: ExtractorConfig.loadFile("./api-extractor.json"),
            configObjectFullPath: "./api-extractor.json",
            projectFolderLookupToken: distPath,
            packageJsonFullPath: Path.join(distPath, "package.json"),
          }),
          {
            // Equivalent to the "--local" command-line parameter
            localBuild: true,

            // Equivalent to the "--verbose" command-line parameter
            showVerboseMessages: true,
          }
        );
        if (!extractorResult.succeeded) {
          ConsoleLogger.error(
            `API Extractor completed with ${extractorResult.errorCount} errors` +
              ` and ${extractorResult.warningCount} warnings`
          );

          return { success: false };
        }*/

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
          return { success: false };
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
                const { name: id, ext } = parse(docFile);
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
                    if (id !== "broadridge-fxl") {
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
                      Path.join(docsPath, key),
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

        ConsoleLogger.info(`Documents successfully generated for ${key}!`);
      }
    }

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(e);

    return { success: false };
  }
};

export default documentExecutor;
