module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/generators/dotnet/restore/impl.ts",
  output: {
    file: "dist/tools/generators/dotnet/restore/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
