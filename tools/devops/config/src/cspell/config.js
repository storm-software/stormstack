module.exports = {
  language: "en",
  dictionaries: ["open-system"],
  dictionaryDefinitions: [
    {
      // The name of the dictionary is used to look it up.
      name: "open-system",
      // Path to the custom word file. Relative to this `cspell.json` file.
      path: "./open-system.dictionary.txt",
      // Some editor extensions will use `addWords` for adding words to your
      // personal dictionary.
      addWords: true,
    },
  ],
  enableFiletypes: ["txt", "js", "jsx", "ts", "tsx", "md", "mdx"],
  ignorePaths: [
    "**/.git/**",
    "**/node_modules/**",
    "**/.docusaurus/**",
    "**/dist/**",
    "**/.next/**",
    "**/pnpm-lock.yaml/**",
    "**/__snapshots__/**",
    "**/__generated__/**",
  ],
  // Ignore files that aren't check in to git as well as files that aren't written
  // by hand. Note that we do want to check, say, JSON files (as package.json
  // contains English text like package descriptions).
  useGitignore: true,
  // GitHub Security Advisories
  ignoreRegExpList: ["GHSA-[-\\w]+"],
  overrides: [
    {
      //Ignore anything in a changelog file that looks like a GitHub username.
      filename: "**/CHANGELOG*.md",
      ignoreRegExpList: ["@[-\\w]+"],
    },
    {
      //Ignore the targets of links in Markdown/MDX files.
      filename: "'**/*.md*",
      ignoreRegExpList: ["\\]\\([^)]+\\)"],
    },
  ],
};
