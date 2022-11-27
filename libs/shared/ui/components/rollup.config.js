const config = require("@nrwl/react/plugins/bundle-rollup");
const svgr = require("@svgr/rollup");

function getRollupOptions(options) {
  const defaultOptions = config(options);

  const outputOptions = {
    ...defaultOptions,
    plugins: [svgr()],
  };

  if (Array.isArray(defaultOptions.plugins)) {
    outputOptions.plugins.push(...defaultOptions.plugins);
  }

  return outputOptions;
}

module.exports = getRollupOptions;
