import { BuildExecutorSchema } from "@nx-dotnet/dotnet";

export type DotNetBuildSchema = BuildExecutorSchema &
  buildKeyMap & {
    configFile?: string;
    baseBuildTarget: string;
  };
