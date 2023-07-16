// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventCatalogBuildExecutorSchema {
  outputPath: string;
  includeDevDependenciesInPackageJson: boolean;
  generateLockfile: boolean;
}
