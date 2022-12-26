module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/generators/typescript/client-api/impl.ts",
  output: {
    file: "dist/tools/generators/typescript/client-api/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
