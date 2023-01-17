module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/generators/dotnet/async-api/impl.ts",
  external: [
    "@asyncapi/generator",
    "@asyncapi/parser",
    "@open-system/core-typescript-utilities",
  ],
  output: {
    file: "dist/tools/generators/dotnet/async-api/impl.js",
    strict: false,
    validate: false,
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
