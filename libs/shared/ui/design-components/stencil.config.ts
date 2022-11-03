import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";

export const config: Config = {
  namespace: "shared-ui-design-components",
  taskQueue: "async",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "dist-custom-elements",
    },
    {
      type: "docs-readme",
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers
    },

    reactOutputTarget({
      componentCorePackage: "@open-system/shared-ui-design-components",
      proxiesFile:
        "..........libs/shared-ui-design-components-react/src/generated/components.ts",
      includeDefineCustomElements: true,
    }),
  ],
};
