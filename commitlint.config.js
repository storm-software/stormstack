module.exports = {
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "subject-case": [
      1,
      "always",
      [
        "sentence-case",
        "start-case",
        "pascal-case",
        "upper-case",
        "kebab-case",
      ],
    ],
    "type-enum": [
      1,
      "always",
      ["chore", "feat", "fix", "docs", "style", "refactor", "test", "revert"],
    ],
  },
};
