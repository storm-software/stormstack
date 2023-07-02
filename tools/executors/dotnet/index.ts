import {
  processProjectGraph,
  projectFilePatterns,
  registerProjectTargets,
} from "@nx-dotnet/core";
import { NxPlugin } from "@nx/devkit";

export const nxPlugin: NxPlugin = {
  name: "@open-system/executors-dotnet",
  processProjectGraph,
  registerProjectTargets,
  projectFilePatterns,
};
