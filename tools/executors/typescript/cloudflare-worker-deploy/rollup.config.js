module.exports = (currentConfig, _) => ({
  ...currentConfig,
  input: "tools/executors/typescript/cloudflare-worker-deploy/impl.ts",
  output: {
    file: "dist/tools/executors/typescript/cloudflare-worker-deploy/impl.js",
    exports: "default",
    format: !Array.isArray(currentConfig.output)
      ? currentConfig.output.format
      : "cjs",
  },
});
