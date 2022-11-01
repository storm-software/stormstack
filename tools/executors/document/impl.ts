import { ExecutorContext } from "@nrwl/devkit";
import { exec } from "child_process";
import { existsSync, writeFile } from "fs-extra";
import { promisify } from "util";
const Path = require("path");
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from "@microsoft/api-extractor";
import { createInterface } from "readline";
import { parse } from "qs";
import { createReadStream, readdir } from "fs";

const execute = async (command: string): Promise<string | undefined> => {
  try {
    let result = await promisify(exec)(command);
    if (result?.stderr) {
      console.error(result.stderr);

      return result.stderr;
    }

    return undefined;
  } catch (e) {
    console.error(e);

    return e?.message ?? "Exception occurred while processing request. ";
  }
};

const LIB_GENERATED_DIR = "__docs__";

const documentExecutor = async (options: {}, context: ExecutorContext) => {
  try {
    console.info(`Executing "document" executor...`);
    console.info(`Options: ${JSON.stringify(options, null, 2)}`);
    console.info(`Current Directory: ${__dirname}`);
    console.info(`context: ${JSON.stringify(context)}`);

    let result;
    for (const [key, project] of Object.entries(context.workspace.projects)) {
      if (!key.endsWith("docs")) {
        console.log(`Begin documenting ${key}`);

        const rootPath = context.root;
        const docsPath = Path.join(rootPath, "docs", "ts-docs");

        const packagePath = Path.join(rootPath, project.root);
        const distPath = Path.join(rootPath, "dist", project.root);

        console.info(`Processing project at path ${packagePath}`);

        console.info("Navigate to root directory.");
        result = await execute(` cd "${rootPath}" `);

        console.info(`Building project "${key}"...`);
        result = await execute(` npx nx run ${key}:build `);
        if (result) {
          console.info(`Error building project "${key}"...`);

          console.error(result);
          return { success: false };
        }
        console.info("Build succeeded.");

        if (existsSync(Path.join(packagePath, "tsconfig.json"))) {
          const input = createReadStream(
            Path.join(packagePath, "tsconfig.json")
          );
          const output = [];
          const lines = createInterface({
            input,
            crlfDelay: Infinity,
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

        console.info(
          `Creating generated directory - "${Path.join(
            distPath,
            LIB_GENERATED_DIR
          )}".`
        );
        result = await execute(
          ` mkdir "${Path.join(distPath, LIB_GENERATED_DIR)}" `
        );
        if (result) {
          console.error(result);
          return { success: false };
        }
        console.info("Directory successfully created.");

        console.info(
          `Creating generated directory - "${Path.join(
            distPath,
            LIB_GENERATED_DIR,
            "reports"
          )}".`
        );
        result = await execute(
          ` mkdir "${Path.join(distPath, LIB_GENERATED_DIR, "reports")}" `
        );
        if (result) {
          console.error(result);
          return { success: false };
        }
        console.info("Directory successfully created.");

        // Invoke API Extractor
        const extractorResult: ExtractorResult = Extractor.invoke(
          ExtractorConfig.prepare({
            configObject: ExtractorConfig.loadFile(
              Path.join(rootPath, "docs", "config", "api-extractor.json")
            ),
            configObjectFullPath: Path.join(
              rootPath,
              "docs",
              "config",
              "api-extractor.json"
            ),
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
          console.error(
            `API Extractor completed with ${extractorResult.errorCount} errors` +
              ` and ${extractorResult.warningCount} warnings`
          );

          return { success: false };
        }

        console.info("Navigate to dist directory.");
        result = await execute(` cd "${distPath}" `);

        result = await execute(
          ` npx api-documenter markdown -i "${Path.join(
            distPath,
            LIB_GENERATED_DIR
          )}" -o "${Path.join(distPath, LIB_GENERATED_DIR, "api")}" `
        );
        if (result) {
          console.error(result);
          return { success: false };
        }

        console.info("Generated markdown.");
        readdir(
          Path.join(distPath, LIB_GENERATED_DIR, "api"),
          async (err: NodeJS.ErrnoException, files: string[]) => {
            !files || !Array.isArray(files) || files.length === 0
              ? console.info("No markdown doc files read")
              : console.info("Formatting markdown doc files");
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
                  crlfDelay: Infinity,
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
                      "---",
                    ];

                    writeFile(
                      Path.join(docsPath, key),
                      header.concat(output).join("\n")
                    );
                  }
                );
              } catch (err) {
                console.error(`Could not process ${docFile}: ${err}`);
              }
            }
          }
        );

        /* console.info(` xcopy "${fromPath}" "${toPath}" `);
          result = await execute(` xcopy "${fromPath}" "${toPath}" `);
          if (result) {
            console.error(result);

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
          console.error(result);

          return { success: false };
        }*/

        console.info(`Documents successfully generated for ${key}!`);
      }
    }

    return { success: !result };
  } catch (e) {
    console.error(e);

    return { success: false };
  }
};

export default documentExecutor;
