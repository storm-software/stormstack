if (process.argv.slice(2).some(arg => arg.includes("package-lock.json"))) {
  console.warn(
    [
      "⚠️ ----------------------------------------------------------------------------------------- ⚠️",
      "⚠️ package-lock.json changed, please run `npm install` to ensure your packages are up to date. ⚠️",
      "⚠️ ----------------------------------------------------------------------------------------- ⚠️",
    ].join("\n")
  );
}
