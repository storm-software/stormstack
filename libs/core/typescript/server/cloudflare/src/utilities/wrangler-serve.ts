/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext, workspaceRoot } from "@nx/devkit";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { ConfigurationError } from "@stormstack/core-shared-utilities";
import Path from "path";
import { WranglerCommand } from "../types";
import { runWranglerCommand } from "./wrangler";

export async function runWranglerServe(
  context: ExecutorContext,
  options?: Record<string, string | boolean | number>
) {
  const { projectName } = context;

  if (!projectName) {
    ConsoleLogger.error("No project name was provided in context object.");
    throw new ConfigurationError("projectName");
  }

  const project = context.workspace?.projects[projectName];
  const buildTarget = project?.targets?.build;

  ConsoleLogger.info("Starting Wrangler Development Server");
  await runWranglerCommand(
    context,
    WranglerCommand.DEV,
    {
      "minify": false,
      "log-level": "debug",
      "no-bundle": false,
      ...options
    },
    Path.join(workspaceRoot, buildTarget?.options?.outputPath, "index.js")
  );
}
