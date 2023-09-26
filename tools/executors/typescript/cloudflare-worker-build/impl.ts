import { ExecutorContext, workspaceRoot } from "@nx/devkit";
import { buildEsbuildOptions } from "@nx/esbuild/src/executors/esbuild/lib/build-esbuild-options";
import { normalizeOptions } from "@nx/esbuild/src/executors/esbuild/lib/normalize";
import { EsBuildExecutorOptions } from "@nx/esbuild/src/executors/esbuild/schema";
import { copyFile } from "@stormstack/core-server-utilities/copy-files";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { build } from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import { existsSync } from "fs";
import { removeSync } from "fs-extra";
import Path from "path";
import { CloudflareWorkerBuildExecutorSchema } from "./schema";

export default async function (
  _options: CloudflareWorkerBuildExecutorSchema,
  context: ExecutorContext
) {
  let result!: unknown;
  try {
    ConsoleLogger.info("Executing Cloudflare Worker Build executor...");

    const project = context.workspace.projects[context.projectName];
    const buildTarget = project.targets.build;

    const options = normalizeOptions(
      {
        format: ["esm"],
        bundle: true,
        skipTypeCheck: true,
        generatePackageJson: true,
        ..._options
      } as EsBuildExecutorOptions,
      context
    );
    const esBuildOptions = buildEsbuildOptions("esm", options, context);

    // const outputPath = Path.join(workspaceRoot, buildTarget.options.outputPath);
    // const mainPath = Path.join(workspaceRoot, buildTarget.options.main);
    if (existsSync(options.outputPath)) {
      removeSync(options.outputPath);
    }

    /*const externalDependencies: DependentBuildableProjectNode[] =
      options.external.reduce((acc, name) => {
        const externalNode = context.projectGraph.externalNodes[`npm:${name}`];
        if (externalNode) {
          acc.push({
            name,
            outputs: [],
            node: externalNode
          });
        }
        return acc;
      }, []);

    if (!options.thirdParty) {
      const thirdPartyDependencies = getExtraDependencies(
        context.projectName,
        context.projectGraph
      );
      for (const tpd of thirdPartyDependencies) {
        options.external.push((tpd.node.data as any).packageName);
        externalDependencies.push(tpd);
      }
    }

    const cpjOptions: Omit<CopyPackageJsonOptions, "format"> = {
      ...options,
      skipTypings: true,
      generateLockfile: true,
      // outputFileExtensionForCjs: ".mjs",
      excludeLibsInPackageJson: !options.thirdParty,
      updateBuildableProjectDepsInPackageJson: externalDependencies.length > 0
    };

    // If we're bundling third-party packages, then any extra deps from external should be the only deps in package.json
    if (options.thirdParty && externalDependencies.length > 0) {
      cpjOptions.overrideDependencies = externalDependencies;
    } else {
      cpjOptions.extraDependencies = externalDependencies;
    }*/

    // await copyPackageJson(cpjOptions as CopyPackageJsonOptions, context);

    const buildOptions = {
      entryPoints: [Path.join(workspaceRoot, buildTarget.options.main)],
      ...esBuildOptions,
      outfile: Path.join(
        workspaceRoot,
        buildTarget.options.outputPath,
        "index.js"
      ),
      resolveExtensions: [".mjs", ".js", ".ts", ".tsx", ".json"],
      write: true,
      treeShaking: true,
      supported: {
        "node-colon-prefix-import": true,
        "node-colon-prefix-require": true
      }
      /*alias: {
        "node:fs": "fs"
      }*/
    };

    const plugins = [...(esBuildOptions.plugins ?? [])];
    if (_options.polyfillNode) {
      plugins.push(
        polyfillNode({
          polyfills: {
            _stream_duplex: false,
            _stream_passthrough: false,
            _stream_readable: false,
            _stream_transform: false,
            _stream_writable: false,
            assert: false,
            "assert/strict": false,
            async_hooks: false,
            buffer: false,
            child_process: true,
            cluster: true,
            console: true,
            constants: true,
            crypto: false,
            dgram: true,
            diagnostics_channel: false,
            dns: true,
            domain: true,
            events: true,
            fs: true,
            "fs/promises": true,
            http: true,
            http2: true,
            https: true,
            module: true,
            net: true,
            os: true,
            path: false,
            perf_hooks: true,
            process: true,
            punycode: true,
            querystring: true,
            readline: true,
            repl: true,
            stream: true,
            string_decoder: false,
            sys: true,
            timers: true,
            "timers/promises": true,
            tls: true,
            tty: true,
            url: true,
            util: true,
            v8: true,
            vm: true,
            wasi: true,
            worker_threads: false,
            zlib: true
          },
          globals: {
            global: true
          }
        })
      );
    } else if (_options.applyLocalPolyfills) {
      plugins.push(
        polyfillNode({
          polyfills: {
            _stream_duplex: false,
            _stream_passthrough: false,
            _stream_readable: false,
            _stream_transform: false,
            _stream_writable: false,
            assert: false,
            "assert/strict": false,
            async_hooks: true,
            buffer: true,
            child_process: false,
            cluster: false,
            console: false,
            constants: false,
            crypto: true,
            dgram: false,
            diagnostics_channel: false,
            dns: false,
            domain: false,
            events: false,
            fs: false,
            "fs/promises": false,
            http: true,
            http2: true,
            https: true,
            module: false,
            net: true,
            os: true,
            path: true,
            perf_hooks: false,
            process: true,
            punycode: true,
            querystring: true,
            readline: false,
            repl: false,
            stream: true,
            string_decoder: false,
            sys: false,
            timers: false,
            "timers/promises": false,
            tls: false,
            tty: true,
            url: false,
            util: true,
            v8: false,
            vm: false,
            wasi: false,
            worker_threads: false,
            zlib: true
          }
        })
      );
    }
    buildOptions.plugins = plugins;

    await build(buildOptions);

    copyFile(
      Path.join(workspaceRoot, project.root, "wrangler.toml"),
      Path.join(workspaceRoot, buildTarget.options.outputPath, "wrangler.toml")
    );
    copyFile(
      Path.join(workspaceRoot, ".env"),
      Path.join(workspaceRoot, buildTarget.options.outputPath, ".dev.vars")
    );
    copyFile(
      Path.join(workspaceRoot, project.root, "README.md"),
      Path.join(workspaceRoot, buildTarget.options.outputPath, "README.md")
    );
    copyFile(
      Path.join(workspaceRoot, "LICENSE"),
      Path.join(workspaceRoot, buildTarget.options.outputPath, "LICENSE")
    );
    copyFile(
      Path.join(workspaceRoot, project.root, "package.json"),
      Path.join(workspaceRoot, buildTarget.options.outputPath, "package.json")
    );

    ConsoleLogger.success(
      `📦 Cloudflare Worker built and packaged successfully for ${context.projectName}.`
    );

    return { success: !result };
  } catch (e) {
    ConsoleLogger.error(
      `An error occurred building the Cloudflare Worker for ${context.projectName}`
    );
    ConsoleLogger.error(e);

    return { success: false };
  }
}
