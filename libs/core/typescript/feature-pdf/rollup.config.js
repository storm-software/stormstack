const url = require("rollup-plugin-url");

module.exports = (currentConfig, _) => ({
  ...currentConfig,
  plugins: [
    ...currentConfig.plugins,
    url({
      include: ["**/*.woff", "**/*.woff2", "**/*.ttf"],
      limit: Infinity,
    }),
  ],
});
