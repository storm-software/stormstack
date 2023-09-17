import { ExecutorContext } from "@nx/devkit";
import { runWranglerServe } from "@open-system/core-server-cloudflare";
import { ConsoleLogger } from "@open-system/core-shared-logging";

export default async function (options: any, context: ExecutorContext) {
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Serve executor...");

    /*await runWranglerServe(context, {
      "minify": false,
      "log-level": "debug",
      "no-bundle": false,
      ...options
    });*/

    const project = context.workspace.projects[context.projectName];
    const buildTarget = project.targets.build;

    await runWranglerServe(context, {});

    /*await runWranglerCommand(
      context,
      WranglerCommand.DEV,
      {
        "minify": false,
        "log-level": "debug",
        "no-bundle": false,
        ...options
      },
      Path.join(workspaceRoot, configuration.main)
    );*/

    /*const nextCommand = `cross-env NO_D1_WARNING=true wrangler ${
      WranglerCommand.DEV
    } "${Path.join(
      workspaceRoot,
      buildTarget.options.outputPath,
      "index.mjs"
    )}" ${Object.entries({
      "minify": false,
      "log-level": "debug",
      "no-bundle": false
    }).reduce(
      (
        ret: string,
        [key, value]: [
          string,
          string | number | boolean | string[] | number[] | boolean[]
        ]
      ) => {
        if (isSet(key) && isSet(value)) {
          ret += ` --${key}=${value} `;
        }

        return ret;
      },
      ""
    )} `;

    try {
      ConsoleLogger.debug(nextCommand);
      await executeAsync(nextCommand, { cwd: buildTarget.options.outputPath });
    } catch (e) {
      ConsoleLogger.error(
        `An error occured executing the command '${nextCommand}'. Halting execution early.`
      );
      console.error(e);
    }*/

    ConsoleLogger.success(
      `Cloudflare Worker Serve successfully ran for ${context.projectName}.`
    );

    return { success: true };
  } catch (e) {
    console.error(
      `An error occurred syncing client API for ${context.projectName}`
    );
    console.error(e);

    return { success: false };
  }
}
