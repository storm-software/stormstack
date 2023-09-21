const config = {
  dryRun: false,
  changelog: true,
  changelogFile: "${PROJECT_DIR}/CHANGELOG.md",
  commitMessage:
    "chore(repo): Changelogs created for v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
  linkCompare: true,
  linkReferences: true,
  npm: true,
  github: true,
  git: true,
  gitAssets: ["${WORKSPACE_DIR}/LICENSE"],
  tagFormat: "${PROJECT_NAME}-v${version}",
  repositoryUrl: process.env.CI_REPO_URL,
  branches: [
    "main",
    "alpha",
    "beta",
    {
      name: "[\\s\\S]+",
      prerelease: true,
    },
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [{ type: "refactor", release: "patch" }],
      },
    ],
    "@semantic-release/release-notes-generator",
  ],
};
