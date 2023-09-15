import { EsBuildExecutorOptions } from "@nx/esbuild/src/executors/esbuild/schema";

export interface CloudflareWorkerBuildExecutorSchema
  extends EsBuildExecutorOptions {
  polyfillNode?: boolean;

  applyLocalPolyfills?: boolean;
}
