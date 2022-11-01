import { Tree } from "@nrwl/devkit";
import { dotnetFactory } from "@nx-dotnet/dotnet";
import {
  getNxDotnetProjects,
  getProjectFilesForProject,
} from "@nx-dotnet/utils";
import { spawnSync } from "child_process";
import { printError, printInfo } from "../utilities";
import { DotNetRestoreSchema } from "./schema";

export default async function (host: Tree, options?: DotNetRestoreSchema) {
  const configFile = options?.configFile;
  const cliCommand = dotnetFactory();
  const projects = await getNxDotnetProjects(host);

  /*process.env.NUGET_REPO_PROXY &&
    logAndExecute({ command: "nuget config" }, [
      "-set",
      `http_proxy=${process.env.NUGET_REPO_PROXY}`,
    ]);*/

  if (process.env.NUGET_REPO_URL) {
    const params = [
      "-Name",
      "Artifactory",
      "-Source",
      process.env.NUGET_REPO_URL,
    ];
    process.env.NUGET_REPO_USERNAME &&
      process.env.NUGET_REPO_PASSWORD &&
      params.push(
        ...[
          "-username",
          process.env.NUGET_REPO_USERNAME,
          "-password",
          process.env.NUGET_REPO_PASSWORD,
        ]
      );
    configFile && params.push(...["--configfile", configFile]);

    logAndExecute({ command: "nuget sources" }, params);

    process.env.NUGET_REPO_USERNAME &&
      process.env.NUGET_REPO_PASSWORD &&
      logAndExecute(
        { command: "nuget setapikey Add" },
        configFile
          ? [
              `${process.env.NUGET_REPO_USERNAME}:${process.env.NUGET_REPO_PASSWORD}`,
              "-Source",
              "Artifactory",
              "--configfile",
              configFile,
            ]
          : [
              `${process.env.NUGET_REPO_USERNAME}:${process.env.NUGET_REPO_PASSWORD}`,
              "-Source",
              "Artifactory",
            ]
      );
  }

  for (const [projectName, project] of Object.entries(projects)) {
    const projectFiles = getProjectFilesForProject(host, project, projectName);
    for (const file of projectFiles) {
      logAndExecute(
        cliCommand,
        configFile
          ? ["restore", file, "--configfile", configFile]
          : ["restore", file]
      );
    }
  }

  logAndExecute(
    cliCommand,
    configFile
      ? ["tool", "restore", "--configfile", configFile]
      : ["tool", "restore"]
  );
}

const logAndExecute = (cliCommand: any, params: string[]): void => {
  params = params.map(param =>
    param.replace(/\$(\w+)/, (_, varName) => process.env[varName] ?? "")
  );

  const cmd = `${cliCommand.command} "${params.join('" "')}"`;
  printInfo(`Executing Command: ${cmd}`);

  const res = spawnSync(cliCommand.command, params, {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  if (res.status !== 0) {
    printError(`dotnet execution returned status code ${res.status}`);
    throw new Error(`dotnet execution returned status code ${res.status}`);
  }
};
