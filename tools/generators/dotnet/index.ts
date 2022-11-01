import { NxPlugin } from "@nrwl/devkit";
import {
  processProjectGraph,
  projectFilePatterns,
  registerProjectTargets,
} from "@nx-dotnet/core";

export const nxPlugin: NxPlugin = {
  name: "@open-system/generators-dotnet",
  processProjectGraph,
  registerProjectTargets,
  projectFilePatterns,
};
