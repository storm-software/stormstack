const glob = require("glob");
const path = require("path");

module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: {
    ...Object.fromEntries(
      glob
        .sync("tools/async-api/kafka/*(hooks|template|utils)/**/*(*.ts|*.tsx)")
        .map(file => [
          path.relative(
            "tools/async-api/kafka",
            file.slice(0, file.length - path.extname(file).length)
          ),
          file,
        ])
    ),
  },
  output: {
    ...currentConfig.output,
    exports: "auto",
    format: "cjs",
    entryFileNames: "[name].js",
    chunkFileNames: "[name].js",
    sourcemap: false,
  },
});
