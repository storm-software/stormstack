import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import autoprefixer from "autoprefixer";
import atImport from "postcss-import";
import tailwind, { tailwindGlobal, tailwindHMR } from "stencil-tailwind-plugin";
import tailwindcss from "tailwindcss";
import tailwindConf from "../../tailwind.config";

export const config: Config = {
  namespace: "design-system-components",
  srcDir: "src",
  globalStyle: "src/style/global.css",
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
      serviceWorker: null,
    },
    reactOutputTarget({
      componentCorePackage: "@open-system/design-system-components",
      proxiesFile:
        "../../libs/shared/ui/components/src/generated/components.ts",
      includeDefineCustomElements: true,
    }),
  ],
  devServer: {
    reloadStrategy: "pageReload",
  },
  preamble:
    "This component originates from the Open System monorepo's Design System\n Component documentation: https://github.com/sullivanpj/open-system\n Copyright © 2023 Open System Solutions, Inc.",

  plugins: [
    // This takes the same configuration options as the main plugin. You can use different configurations if you want
    tailwindGlobal({
      postcss: {
        plugins: [atImport(), tailwindcss(), autoprefixer()],
      },
      //tailwindCssPath: "./src/style/global.css",
      tailwindCssContents:
        "@import url('C:\\Development\\open-system\\dist\\design-system\\tokens\\css\\fonts.css');@tailwind base;@tailwind utilities;@tailwind components;",
      tailwindConf: {
        content: [
          "C:\\Development\\open-system\\design-system\\components\\src",
        ],
        theme: {
          ...tailwindConf?.theme,
        },
        variants: {
          ...tailwindConf?.variants,
        },
        plugins: [require("@tailwindcss/forms")],
      },
    }),
    tailwind({
      postcss: {
        plugins: [atImport(), tailwindcss(), autoprefixer()],
      },
      //tailwindCssPath: "./src/style/global.css",
      tailwindCssContents:
        "@import url('C:\\Development\\open-system\\dist\\design-system\\tokens\\css\\fonts.css');@tailwind base;@tailwind utilities;@tailwind components;",
      tailwindConf: {
        content: [
          "C:\\Development\\open-system\\design-system\\components\\src",
        ],
        theme: {
          ...tailwindConf?.theme,
        },
        variants: {
          ...tailwindConf?.variants,
        },
        plugins: [require("@tailwindcss/forms")],
      },
    }),
    tailwindHMR(),
  ],

  testing: {
    setupFiles: ["./jest.setup.js"],

    /**
     * Indicates whether the coverage information should be collected while executing the test. Because this retrofits all
     * executed files with coverage collection statements, it may significantly slow down your tests. Default: false
     */
    collectCoverage: true,

    /**
     * An array of glob patterns indicating a set of files for which coverage information should be collected.
     * If a file matches the specified glob pattern, coverage information will be collected for it even if no tests exist
     * for this file and it's never required in the test suite. Default: undefined
     */
    collectCoverageFrom: ["**/*.spec.tsx", "**/*.spec.ts"],

    /**
     * The directory where Jest should output its coverage files. Default: undefined
     */
    coverageDirectory: "../../coverage",

    /**
     * A list of reporter names that Jest uses when writing coverage reports. Any istanbul reporter can be used.
     * Default: ["json", "lcov", "text"]
     */
    coverageReporters: ["lcov"],
  },
};
