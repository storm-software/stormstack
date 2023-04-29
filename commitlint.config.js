/** @type {import('cz-git').UserConfig} */
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
      [
        "chore",
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "build",
        "ci",
        "test",
        "revert",
      ],
    ],
  },
  "prompt": {
    "alias": { "fd": "docs: fix typos" },

    "messages": {
      "type": "Select the type of change that you're committing:",
      "scope": "Denote the SCOPE of this change (optional):",
      "customScope": "Denote the SCOPE of this change:",
      "subject": "Write a SHORT, IMPERATIVE tense description of the change:\n",
      "body":
        'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      "breaking":
        'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      "footer": "List any ISSUES by this change. E.g.: #31, #34:\n",
      "confirmCommit":
        "Are you sure you want to proceed with the commit above?",
    },
    "types": [
      {
        "value": "feat",
        "name": "feat:     A new feature",
        "emoji": ":sparkles:",
      },
      { "value": "fix", "name": "fix:      A bug fix", "emoji": ":bug:" },
      {
        "value": "docs",
        "name": "docs:     Documentation only changes",
        "emoji": ":memo:",
      },
      {
        "value": "style",
        "name": "style:    Changes that do not affect the meaning of the code",
        "emoji": ":lipstick:",
      },
      {
        "value": "refactor",
        "name":
          "refactor: A code change that neither fixes a bug nor adds a feature",
        "emoji": ":recycle:",
      },
      {
        "value": "perf",
        "name": "perf:     A code change that improves performance",
        "emoji": ":zap:",
      },
      {
        "value": "test",
        "name": "test:     Adding missing tests or correcting existing tests",
        "emoji": ":white_check_mark:",
      },
      {
        "value": "build",
        "name":
          "build:    Changes that affect the build system or external dependencies",
        "emoji": ":package:",
      },
      {
        "value": "ci",
        "name": "ci:       Changes to our CI configuration files and scripts",
        "emoji": ":ferris_wheel:",
      },
      {
        "value": "chore",
        "name": "chore:    Other changes that don't modify src or test files",
        "emoji": ":hammer:",
      },
      {
        "value": "revert",
        "name": "revert:   Reverts a previous commit",
        "emoji": ":rewind:",
      },
    ],

    "scopes": [
      {
        "name": "design-system",
        "description":
          "Anything related to the repository's design-system projects (ex: design-system/components, design-system/tokens, storybook, etc.)",
        "emoji": ":art:",
      },
      {
        "name": "tools",
        "description":
          "Anything related to the helper projects in the tools/ directory",
        "emoji": ":hammer_and_wrench:",
      },
      {
        "name": "docs",
        "description": "Anything related to the docusaurus site",
        "emoji": ":memo:",
      },

      {
        "name": "web-shell",
        "description": "Anything related to the `web-shell` application",
        "emoji": ":shell:",
      },
      //{ "name": 'web-landing', "description": 'Anything related to the `web-landing` application', "emoji": ':house:' },
      {
        "name": "shared",
        "description":
          "Anything related to the `shared` applications and libraries",
        "emoji": ":chains:",
      },
      {
        "name": "blog-engagement",
        "description": "Anything related to the `blog-engagement` domain",
        "emoji": ":lock:",
      },
      {
        "name": "message",
        "description": "Anything related to the `message` domain",
        "emoji": ":envelope:",
      },
      {
        "name": "user-account",
        "description": "Anything related to the `user-account` domain",
        "emoji": ":lock:",
      },

      {
        "name": "repo",
        "description":
          "anything related to managing the repo itself (ex: bundling, maintenance, etc.)",
        "emoji": ":package:",
      },
      {
        "name": "test",
        "description": "anything testing specific (e.g., jest or cypress)",
        "emoji": ":test_tube:",
      },
      {
        "name": "misc",
        "description": "misc stuff",
        "emoji": ":open_file_folder:",
      },
    ],
    "allowCustomScopes": false,
    "allowEmptyScopes": false,
    "allowBreakingChanges": ["feat", "fix"],
    "skipQuestions": ["ticketNumber"],
    "emojiAlign": "center",
    "themeColorCode": "#2b2347",
    "upperCaseSubject": false,
    "markBreakingChangeMode": false,
    "allowBreakingChanges": ["feat", "fix"],
    "subjectLimit": 150,
    "breaklineNumber": 100,
    "breaklineChar": "|",
    "issuePrefixs": [
      { "value": "closed", "name": "closed:   ISSUES has been processed" },
    ],
    "customIssuePrefixsAlign": "top",
    "emptyIssuePrefixsAlias": "skip",
    "customIssuePrefixsAlias": "custom",
    "allowCustomIssuePrefixs": true,
    "allowEmptyIssuePrefixs": true,
    "confirmColorize": true,
    "maxHeaderLength": Infinity,
    "maxSubjectLength": Infinity,
    "minSubjectLength": 0,
    "scopeOverrides": undefined,
    "defaultBody": "",
    "defaultIssues": "",
    "defaultScope": "",
    "defaultSubject": "",
  },
};
