import { StencilBuildOptions } from "@nxext/stencil";

export type DesignComponentsBuildExecutorSchema = StencilBuildOptions & {
  baseBuildTarget: true;
  clean?: boolean;
};
