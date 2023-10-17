const Path = require("path");
const { quote } = require("shell-quote");

const isWin = process.platform === "win32";

const escape = input => {
  const escaped = quote(input);
  return escaped.replace(/\\@/g, "@");
};

module.exports = {
  "!(tools/{devops/docker/**/*,forecast/plugins/**/*.hbs})/**/*.*":
    fileNames => {
      const escapedFileNames = fileNames
        .map(filename => (isWin ? filename : escape(filename)))
        .join(" ");

      return ["pnpm nx format", `git add ${escapedFileNames}`];
    },
  "**/*.{js,jsx,ts,tsx,json,css,scss,md,mdx,yml,yaml,graphql,html,prisma,4cast}":
    fileNames => {
      const escapedFileNames = fileNames
        .map(filename => (isWin ? filename : escape(filename)))
        .join(" ");

      return [
        `prettier --with-node-modules --ignore-path .prettierignore_staged --write ${escapedFileNames}`,
        `git add ${escapedFileNames}`
      ];
    },
  "**/*.{js,jsx,mjs,ts,tsx,mts,md,mdx}": fileNames => {
    const escapedFileNames = fileNames
      .map(filename => (isWin ? filename : escape(filename)))
      .join(" ");

    return ["pnpm lint:language", `git add ${escapedFileNames}`];
  },
  "**/*.{js,jsx,mjs,ts,tsx,mts}": fileNames => {
    const escapedFileNames = fileNames
      .map(filename => (isWin ? filename : escape(filename)))
      .join(" ");

    return [
      `prettier --with-node-modules --ignore-path ${Path.join(
        "dist",
        "tools/devops/config",
        ".prettierignore_staged"
      )} --write ${escapedFileNames}`,
      "pnpm nx format:write --uncommitted",
      `git add ${escapedFileNames}`
    ];
  },
  "**/*.{ts,tsx,md,mdx}": fileNames => {
    const escapedFileNames = fileNames
      .map(filename => (isWin ? filename : escape(filename)))
      .join(" ");

    return ["pnpm typecheck", `git add ${escapedFileNames}`];
  },
  "**/README.md": fileNames => {
    const escapedFileNames = fileNames
      .map(filename => (isWin ? filename : escape(filename)))
      .join(" ");

    return [
      'pnpm nx generate @stormstack/tools-nx-monorepo:format-readme --templatePath="libs/core/config/src/readme-templates" --no-interactive',
      `git add ${escapedFileNames}`
    ];
  }
};
