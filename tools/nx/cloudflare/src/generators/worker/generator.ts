import {
  Tree,
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  names,
  readProjectConfiguration
} from "@nx/devkit";
import { applicationGenerator } from "@nx/node";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { CloudflareWorkerGeneratorSchema } from "./schema";

export default async function (
  host: Tree,
  options?: CloudflareWorkerGeneratorSchema
) {
  try {
    ConsoleLogger.info("Executing Cloudflare Worker generator...");

    await applicationGenerator(host, {
      ...options,
      bundler: "esbuild",
      framework: "none",
      standaloneConfig: true,
      port: null,
      rootProject: null
    });

    const appName =
      (options.directory ? `${options.directory}-` : "") + options.name;
    const projectConfiguration = readProjectConfiguration(host, appName);
    const projectRoot = projectConfiguration.root;

    const templatePath = joinPathFragments(__dirname, "./files");
    const substitutions = {
      tmpl: "", // remove __tmpl__ from filenames
      zone_id: options.zoneId ?? "",
      account_id: options.accountId ?? "",
      route: options.route ?? "",
      workers_dev: options.workersDev ?? true,
      compatibility_date: new Date().toISOString().split("T")[0],
      ...names(options.name)
    };

    // remove all files that were created except for the config files
    host
      .listChanges()
      .filter(
        fileChange =>
          fileChange.type === "CREATE" &&
          !fileChange.path.endsWith("/project.json") &&
          !fileChange.path.endsWith(".eslintrc.json") &&
          fileChange.path !== "workspace.json"
      )
      .forEach(fileChange => {
        host.delete(fileChange.path);
      });

    generateFiles(host, templatePath, projectRoot, substitutions);

    await formatFiles(host);
    // updateGitIgnore(host);
    // addTargets(host, options.name);

    return () => {
      installPackagesTask(host);

      ConsoleLogger.success(
        `Cloudflare Worker successfully generated for ${options.name}.`
      );
    };
  } catch (e) {
    console.error(e);
    ConsoleLogger.error(e);

    return { success: false };
  }
}
