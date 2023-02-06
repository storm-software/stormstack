module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/executors/typescript/client-api-joi-sync/impl.ts",
  output: {
    file: "dist/tools/executors/typescript/client-api-joi-sync/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
