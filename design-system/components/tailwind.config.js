const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind");
const { join } = require("path");
const extend = require("../../dist/design-system/tokens/js/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      "{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}"
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend,
  },
  plugins: [],
};
