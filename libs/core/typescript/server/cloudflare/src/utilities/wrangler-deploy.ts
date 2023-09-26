/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext, workspaceRoot } from "@nx/devkit";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { formatDate } from "@stormstack/core-shared-utilities/common/date-fns";
import { ConfigurationError } from "@stormstack/core-shared-utilities/errors";
import Path from "path";
import { WranglerCommand } from "../types";
import { runWranglerCommand } from "./wrangler";

export async function runWranglerDeploy(
  context: ExecutorContext,
  options?: Record<string, string | boolean | number>
) {
  const projectName = context.projectName;

  if (!projectName) {
    ConsoleLogger.error("No project name was provided in context object.");
    throw new ConfigurationError("projectName");
  }

  const project = context.workspace?.projects[projectName];
  const buildTarget = project?.targets?.build;

  ConsoleLogger.info("Deploying Worker to Cloudflare");
  await runWranglerCommand(
    context,
    WranglerCommand.PUBLISH,
    {
      "latest": true,
      "compatibility-date": formatDate(),
      "minify": true,
      "log-level": "warn",
      "no-bundle": false,
      ...options
    },
    Path.join(workspaceRoot, buildTarget?.options?.outputPath, "index.js")
  );
}
