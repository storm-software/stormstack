module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/generators/dotnet/server-api/impl.ts",
  output: {
    file: "dist/tools/generators/dotnet/server-api/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
