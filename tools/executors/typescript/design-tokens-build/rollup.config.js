module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/executors/typescript/design-tokens-build/impl.ts",
  output: {
    file: "dist/tools/executors/typescript/design-tokens-build/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
