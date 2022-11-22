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
        "app-title-1": ["var(--font-barrio)", ...fontFamily.sans],
        "header-1": ["var(--font-permanent-marker)", ...fontFamily.sans],
        "body-1": ["var(--font-anybody)", ...fontFamily.sans],
        "body-2": ["var(--font-inter)", ...fontFamily.sans],
        "label-1": ["var(--font-anybody)", ...fontFamily.sans],
        "btn-label-1": ["var(--font-poppins)", ...fontFamily.sans],
      },
    },
    variants: {},
    plugins: [],
  },
};
