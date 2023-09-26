export interface ReleaseGeneratorSchema {
  dryRun?: boolean;
  clearLocalRegistry: boolean;
  local: boolean;
  force?: boolean;
  from?: string;
  version?: string;
  gitRemote: string;
}
