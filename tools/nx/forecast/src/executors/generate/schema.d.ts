import { PackageManagers } from "@stormstack/core-server-utilities";

export interface ForecastGenerateExecutorSchema {
  schema: string;
  output: string;
  packageManager: PackageManagers;
  dependencyCheck: boolean;
}
