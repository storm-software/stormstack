import { ExecutorContext, workspaceRoot } from "@nx/devkit";
import { createAsyncIterable } from "@nx/devkit/src/utils/async-iterable";
import { waitForPortOpen } from "@nx/web/src/utils/wait-for-port-open";
import { copyFile, copyFiles } from "@stormstack/core-server-utilities";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { fork } from "child_process";
import { ensureDirSync, existsSync, removeSync } from "fs-extra";
import Path from "path";
import { EventCatalogServeExecutorSchema } from "./schema";

export default async function* (
  options: EventCatalogServeExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Executing Event Catalog Serve executor...");
    const { port, hostname } = options;

    const buildTarget =
      context.workspace.projects[context.projectName].targets.build;

    const outputPath = Path.join(
      workspaceRoot,
      context.workspace.projects[context.projectName].sourceRoot,
      "dist"
    );
    if (existsSync(outputPath)) {
      removeSync(outputPath);
    }

    const packagePath = Path.join(__dirname, "catalog-package");
    if (!existsSync(packagePath)) {
      ConsoleLogger.error(
        `Event Catalog website package path does not exist - "${packagePath}"`
      );
      return { success: false };
    }

    ConsoleLogger.info("Ensuring package path exists");
    ensureDirSync(packagePath);

    ConsoleLogger.info("Copying files from package path");
    copyFiles(packagePath, outputPath);
    copyFile(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "eventcatalog.config.js"
      ),
      Path.join(outputPath, "eventcatalog.config.js")
    );
    copyFiles(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "public"
      ),
      Path.join(outputPath, "public")
    );
    copyFiles(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "domains"
      ),
      Path.join(outputPath, "domains")
    );
    copyFiles(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "events"
      ),
      Path.join(outputPath, "events")
    );
    copyFiles(
      Path.join(
        workspaceRoot,
        context.workspace.projects[context.projectName].sourceRoot,
        "services"
      ),
      Path.join(outputPath, "services")
    );

    ConsoleLogger.info("Running Event Catalog Serve");
    /*await executeAsync(
      `npx next dev ${outputPath} -p ${port} -H ${hostname ?? "localhost"} `,
      {
        cwd: outputPath,
      }
    );*/

    const nextBin = require.resolve("next/dist/bin/next");
    process.env.PROJECT_DIR = outputPath;

    yield* createAsyncIterable<{ success: boolean; baseUrl: string }>(
      async ({ done, next, error }) => {
        const server = fork(
          nextBin,
          ["dev", "-p", `${port}`, "-H", `${hostname ?? "localhost"}`],
          {
            cwd: outputPath,
            stdio: "inherit"
          }
        );

        server.once("exit", code => {
          if (code === 0) {
            done();
          } else {
            error(new Error(`Next.js app exited with code ${code}`));
          }
        });

        const killServer = () => {
          if (server.connected) {
            server.kill("SIGTERM");
          }
        };
        process.on("exit", () => killServer());
        process.on("SIGINT", () => killServer());
        process.on("SIGTERM", () => killServer());
        process.on("SIGHUP", () => killServer());

        await waitForPortOpen(port);

        try {
          next({
            success: true,
            baseUrl: `http://${hostname ?? "localhost"}:${port}`
          });
        } catch (e) {
          ConsoleLogger.error("Error in process");
          error(e);
        }
      }
    );

    ConsoleLogger.success(
      `Event Catalog Serve successfully ran for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred executing Event Catalog Serve for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
