module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/executors/dotnet/build/impl.ts",
  output: {
    file: "dist/tools/executors/dotnet/build/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
