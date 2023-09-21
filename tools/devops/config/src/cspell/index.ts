const config = {
  language: "en",
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

export default config;
