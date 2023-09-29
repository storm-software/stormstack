import { PackageManagers } from "@stormstack/core-server-utilities";

export interface ForecastGenerateExecutorSchema {
  schema: string;
  outputPath: string;
  packageManager: PackageManagers;
  dependencyCheck: boolean;
}
