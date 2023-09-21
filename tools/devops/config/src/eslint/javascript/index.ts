import { Linter } from "eslint";
import importRules from "../rules/import";
import openSystemRules from "../rules/open-system";
import unicornRules from "../rules/unicorn";

const config: Linter.Config = {
  root: true,
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      extends: ["plugin:@nx/javascript"],
      plugins: ["unicorn", "import"],
      rules: {
        ...importRules,
        ...unicornRules,
        ...openSystemRules,
      },
    },
  ],
};

export default config;
