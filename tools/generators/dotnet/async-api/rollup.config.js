module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/generators/dotnet/async-api/impl.ts",
  output: {
    file: "dist/tools/generators/dotnet/async-api/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
