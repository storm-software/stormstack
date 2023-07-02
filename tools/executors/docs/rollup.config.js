module.exports = (currentConfig, _) => ({
  ...currentConfig,
  output: {
    ...currentConfig.output,
    exports: "auto",
    format: "cjs",
    entryFileNames: "[name].js",
    chunkFileNames: "[name].js",
    sourcemap: false,
  },
});
