export type PackageManagers = "npm" | "yarn" | "pnpm";

export interface StormGenerateExecutorSchema {
  schema: string;
  outputPath: string;
  packageManager: PackageManagers;
  dependencyCheck: boolean;
}
