module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/generators/typescript/cloudflare-worker/impl.ts",
  output: {
    file: "dist/tools/generators/typescript/cloudflare-worker/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
