module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/executors/typescript/client-redux-sync/impl.ts",
  output: {
    file: "dist/tools/executors/typescript/client-redux-sync/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
