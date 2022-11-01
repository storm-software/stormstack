import { ExecutorContext, runExecutor } from "@nrwl/devkit";
import { execute, printError, printSuccess } from "../utilities";
import { DotNetBuildSchema } from "./schema";

export default async function (
  options: DotNetBuildSchema,
  context: ExecutorContext
) {
  try {
    const { configFile, source, baseBuildTarget } = options;

    /*process.env.NUGET_REPO_PROXY &&
    (await execute(
      `dotnet nuget config -set http_proxy=${process.env.NUGET_REPO_PROXY}`
    ));*/

    if (process.env.NUGET_REPO_URL) {
      await execute("dotnet nuget remove source Artifactory ");

      let params = ` add source ${process.env.NUGET_REPO_URL} --name Artifactory `;

      process.env.NUGET_REPO_USERNAME &&
        process.env.NUGET_REPO_PASSWORD &&
        (params += ` --username ${process.env.NUGET_REPO_USERNAME} --password 24Server! --store-password-in-clear-text `);
      configFile && (params += ` --configfile ${configFile} `);
      await execute(`dotnet nuget ${params}`);
    }

    let extraParameters = options.extraParameters ?? "";
    configFile && (extraParameters += ` --configfile ${configFile} `);
    !source &&
      process.env.NUGET_REPO_URL &&
      (extraParameters += ` --source ${process.env.NUGET_REPO_URL} `);

    for await (const output of await runExecutor(
      {
        project: context.projectName,
        target: baseBuildTarget,
        configuration: "docker",
      },
      {
        verbosity: "normal",
        ...options,
        configFile: undefined,
        baseBuildTarget: undefined,
        extraParameters,
      },
      context
    )) {
      if (!output.success) {
        printError(`An error occurred building ${context.projectName}`);
        throw new Error(`An error occurred building ${context.projectName}`);
      }
    }

    printSuccess("Build process succeeded");

    return { success: true };
  } catch (e) {
    printError(`An error occurred building ${context.projectName}`);
    printError(e);

    return { success: false };
  }
}
