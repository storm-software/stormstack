module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/executors/dotnet/server-api-sync/impl.ts",
  output: {
    file: "dist/tools/executors/dotnet/server-api-sync/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
