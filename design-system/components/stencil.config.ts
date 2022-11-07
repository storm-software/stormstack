import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import tailwind, { tailwindHMR } from "stencil-tailwind-plugin";

export const config: Config = {
  namespace: "design-system-components",
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
      componentCorePackage: "@open-system/design-system-components",
      proxiesFile:
        "../../../../../libs/shared/ui/components/src/generated/components.ts",
      includeDefineCustomElements: true,
    }),
  ],
  plugins: [tailwind(), tailwindHMR()],
};
