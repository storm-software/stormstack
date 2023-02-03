const url = require("rollup-plugin-url");

module.exports = (currentConfig, _) => ({
  ...currentConfig,
  plugins: [
    ...currentConfig.plugins,
    url({
      // by default, rollup-plugin-url will not handle font files
      include: ["**/*.woff", "**/*.woff2", "**/*.ttf"],
      // setting infinite limit will ensure that the files
      // are always bundled with the code, not copied to /dist
      limit: Infinity,
    }),
  ],
});
