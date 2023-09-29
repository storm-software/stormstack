import { PackageManagers } from "@stormstack/core-server-utilities";

export interface ForecastGenerateGeneratorSchema {
  schema: string;
  outputPath: string;
  packageManager: PackageManagers;
  dependencyCheck: boolean;
}
