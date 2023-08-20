const webpack = require("webpack");
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = function (context, options) {
  return {
    name: "webpack-plugin",
    configureWebpack(config, isServer, utils) {
      return {
        mode: "production",
        plugins: [
          new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
          }),
        ],
      };
    },
  };
};
