const config = {
  dryRun: false,
  changelog: true,
  changelogFile: "${PROJECT_DIR}/CHANGELOG.md",
  commitMessage:
    "release(${PROJECT_DIR}): Changelogs generated for v${nextRelease.version}\n\n${nextRelease.notes}",
  linkCompare: true,
  linkReferences: true,
  npm: true,
  github: true,
  githubOptions: {
    "assets": [
      { "path": "dist/${PROJECT_DIR}/**/*.css", "label": "CSS distribution" },
      { "path": "dist/${PROJECT_DIR}/**/*.js", "label": "JS distribution" },
      {
        "path": "dist/${PROJECT_DIR}/**/meta.esm.json",
        "label": "JS Meta distribution"
      },
      {
        "path": "dist/${PROJECT_DIR}/**/*.cjs",
        "label": "CommonJS distribution"
      },
      {
        "path": "dist/${PROJECT_DIR}/**/meta.cjs.json",
        "label": "CommonJS Meta distribution"
      },
      { "path": "dist/${PROJECT_DIR}/**/LICENSE", "label": "Package License" },
      { "path": "dist/${PROJECT_DIR}/**/README.md", "label": "Package ReadMe" },
      {
        "path": "dist/${PROJECT_DIR}/**/package.json",
        "label": "Package JSON distribution"
      },
      {
        "path": "dist/${PROJECT_DIR}/**/*.*",
        "label": "Misc. Package distribution"
      }
    ]
  },
  git: true,
  gitAssets: ["${WORKSPACE_DIR}/LICENSE", "${WORKSPACE_DIR}/assets/favicons"],
  tagFormat: "${PROJECT_NAME}-v${version}",
  packageJsonDir: "${PROJECT_DIR}",
  repositoryUrl: process.env.CI_REPO_URL,
  branches: [
    "main",
    "alpha",
    "beta",
    {
      name: "[\\s\\S]+",
      prerelease: true
    }
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        // JSON Schema: https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.0.0/schema.json
        presetConfig: {
          header: "# ${PROJECT_NAME} v${version} Changelog\n\n",
          preMajor: process.env.CI_PRE_MAJOR,
          releaseCommitMessageFormat:
            "release(${PROJECT_DIR}): Changelogs generated for v${nextRelease.version}\n\n${nextRelease.notes}"
        },
        releaseRules: [{ type: "refactor", release: "patch" }]
      }
    ],
    "@semantic-release/release-notes-generator"
  ]
};
