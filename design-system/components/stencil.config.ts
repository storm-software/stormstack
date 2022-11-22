import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import autoprefixer from "autoprefixer";
import atImport from "postcss-import";
// import nodePolyfills from "rollup-plugin-node-polyfills";
import tailwind, { tailwindGlobal, tailwindHMR } from "stencil-tailwind-plugin";
import tailwindcss from "tailwindcss";
import tailwindConf from "../../tailwind.config";

export const config: Config = {
  namespace: "open-system",
  srcDir: "src",
  globalStyle: "src/style/global.css",
  taskQueue: "async",
  invisiblePrehydration: true,
  hydratedFlag: {
    /**
     * Defaults to `hydrated`.
     */
    name: "hydrated",
    /**
     * Can be either `class` or `attribute`. Defaults to `class`.
     */
    selector: "class",
    /**
     * The CSS property used to show and hide components. Defaults to use the CSS `visibility`
     * property. Other commonly used CSS properties would be `display` with the `initialValue`
     * setting as `none`, or `opacity` with the `initialValue` as `0`. Defaults to `visibility`
     * and the default `initialValue` is `hidden`.
     */
    property: "display",
    /**
     * This is the CSS value to give all components before it has been hydrated.
     * Defaults to `hidden`.
     */
    initialValue: "none",
    /**
     * This is the CSS value to assign once a component has finished hydrating.
     * This is the CSS value that'll allow the component to show. Defaults to `inherit`.
     */
    hydratedValue: "inherit",
  },
  enableCache: true,
  buildEs5: true,
  extras: {
    /**
     * Dynamic `import()` shim. This is only needed for Edge 18 and below, and Firefox 67
     * and below. Defaults to `false`.
     */
    dynamicImportShim: true,
    /**
     * Experimental flag. Projects that use a Stencil library built using the `dist` output target may have trouble lazily
     * loading components when using a bundler such as Vite or Parcel. Setting this flag to `true` will change how Stencil
     * lazily loads components in a way that works with additional bundlers. Setting this flag to `true` will increase
     * the size of the compiled output. Defaults to `false`.
     */
    experimentalImportInjection: true,
  },
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "dist-custom-elements",
      generateTypeDeclarations: true,
    },
    {
      type: "dist-hydrate-script",
    },
    {
      type: "docs-readme",
    },
    {
      type: "docs-vscode",
      file: "vscode-data.json",
    },
    {
      type: "www",
      serviceWorker: null,
    },
    reactOutputTarget({
      componentCorePackage: "@open-system/design-system-components",
      proxiesFile:
        "../../../libs/shared/ui/components/src/__generated__/components.ts",
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
        "@tailwind base;@tailwind utilities;@tailwind components;",
      tailwindConf: {
        content: ["../../design-system/components/src"],
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
        "@tailwind base;@tailwind utilities;@tailwind components;",
      tailwindConf: {
        content: ["../../design-system/components/src"],
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
  /*rollupPlugins: {
    after: [nodePolyfills()],
  },*/
  testing: {
    setupFiles: ["./jest.setup.js"],
  },
};
