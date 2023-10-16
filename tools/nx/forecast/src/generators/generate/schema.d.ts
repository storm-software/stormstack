import { PackageManagers } from "@stormstack/core-server-utilities";

export interface ForecastGenerateGeneratorSchema {
  schema: string;
  output: string;
  packageManager: PackageManagers;
  dependencyCheck: boolean;
}
