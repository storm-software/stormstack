module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/executors/typescript/tsdocs-clean/impl.ts",
  output: {
    file: "dist/tools/executors/typescript/tsdocs-clean/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
