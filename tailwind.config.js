const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind");
const { join } = require("path");
const { fontFamily } = require("tailwindcss/defaultTheme");
const extend = require("./dist/design-system/tokens/js/theme");
const plugin = require("tailwindcss/plugin");

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
        "app-title-1": ["var(--font-melody)", ...fontFamily.sans],
        "header-1": ["var(--font-permanent-marker)", ...fontFamily.sans],
        "body-1": ["var(--font-anybody)", ...fontFamily.sans],
        "body-2": ["var(--font-inter)", ...fontFamily.sans],
        "label-1": ["var(--font-anybody)", ...fontFamily.sans],
        "btn-label-1": ["var(--font-poppins)", ...fontFamily.sans],
        "like-label": ["var(--font-permanent-marker)", ...fontFamily.sans],
      },
      textShadow: {
        ...extend.textShadow,
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 0 80px rgba(var(--tw-shadow-color), 0.8), 0 0 32px rgba(var(--tw-shadow-color), 0.3)",
      },
      backgroundImage: {
        "bg-title": "url(../../../../assets/bg-title.jpg)",
      },
    },
    variants: {},
    plugins: [
      plugin(({ matchUtilities, theme }) => {
        matchUtilities(
          {
            "text-shadow": value => ({
              textShadow: value,
            }),
          },
          { values: theme("textShadow") }
        );
      }),
    ],
  },
};
