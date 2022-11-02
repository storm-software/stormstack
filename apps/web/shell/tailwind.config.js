const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind");
const { join } = require("path");
const kebabcase = require("lodash.kebabcase");
const variables = require("../../../dist/libs/shared/ui/design-tokens/js/variables.js");

const colors = Object.fromEntries(
  Object.values(variables.color).reduce((ret, { attributes, value }) => {
    console.log(attributes);
    console.log(value);
    if (attributes && attributes.type && value) {
      ret.push([kebabcase(attributes.type), value]);
    }

    return ret;
  }, [])
);

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
    colors,
    extend: {},
  },
  plugins: [],
};
