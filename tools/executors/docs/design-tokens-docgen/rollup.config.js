module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/executors/docs/design-tokens-docgen/impl.ts",
  output: {
    file: "dist/tools/executors/docs/design-tokens-docgen/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
