import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import url from "rollup-plugin-url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  cacheDir: "../../../../../node_modules/.vite/core-client-api",

  plugins: [
    react(),
    nxViteTsPaths(),
    dts({
      entryRoot: "src",
      tsConfigFilePath: path.join(__dirname, "tsconfig.lib.json"),
      skipDiagnostics: true
    }),
    url({
      name: "fonts",
      include: ["**/*.woff", "**/*.woff2", "**/*.ttf"],
      limit: Infinity
    })
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    "lib": {
      "entry": "src/index.ts",
      "name": "core-client-pdf",
      "fileName": "index",
      "formats": ["es", "cjs"]
    },
    "rollupOptions": {
      "external": ["'react'", "'react-dom'", "'react/jsx-runtime'"]
    }
  }
});
