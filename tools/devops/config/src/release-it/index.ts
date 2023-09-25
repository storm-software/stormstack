const config = {
  "dry-run": false,
  git: {
    tagMatch: "[!@]*",
    tagName: "v${version}",
    commitMessage: "release(repo): Changelogs generated v${version}",
    requireCleanWorkingDir: true,
  },
  npm: {
    publish: false,
  },
  github: {
    release: false,
    releaseName: "v${version}",
    autoGenerate: true,
    tokenRef: "GITHUB_TOKEN",
  },
  hooks: {
    "after:bump": "pnpm install --filter ./apps/web/shell --lockfile-only",
  },
  plugins: {
    "@release-it/bumper": {
      out: [
        {
          file: "apps/web/shell/package.json",
          path: "version",
        },
      ],
    },
  },
};

export default config;
