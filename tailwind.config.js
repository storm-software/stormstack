const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind");
const { join } = require("path");
const { fontFamily } = require("tailwindcss/defaultTheme");
const extend = require("./dist/design-system/tokens/js/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, "apps/web/shell/app/**/*!(*.stories|*.spec).{ts,tsx,html}"),
    ...createGlobPatternsForDependencies(join(__dirname, "apps/web/shell/app")),
  ],
  theme: {
    extend: {
      ...extend,
      fontFamily: {
        ...extend.fontFamily,
        barrio: ["var(--font-barrio)", ...fontFamily.sans],
        inter: ["var(--font-inter)", ...fontFamily.sans],
      },
    },
    variants: {},
    plugins: [],
  },
};
