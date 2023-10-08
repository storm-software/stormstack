// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("./eventcatalog.config");

module.exports = {
  output: "export",
  reactStrictMode: true,
  basePath: config.basePath,
  trailingSlash: config.trailingSlash,
  publicRuntimeConfig: {
    basePath: config.basePath
  }
};
