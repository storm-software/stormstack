const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind");
const { join } = require("path");
const extend = require("./dist/design-system/tokens/js/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      "apps/web/shell/ClientApp/app/**/*!(*.stories|*.spec).{ts,tsx,html}"
    ),
    ...createGlobPatternsForDependencies(
      join(__dirname, "apps/web/shell/ClientApp/app")
    ),
  ],
  theme: {
    extend: {
      ...extend,
      borderRadius: {
        ...extend.borderRadius,
        drawn: "255px 15px 225px 15px/15px 225px 15px 255px",
      },
    },
    variants: {},
    plugins: [],
  },
};
