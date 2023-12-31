/* eslint-disable */
export default {
  displayName: "core-server-domain",
  preset: "../../../../../testing/jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory:
    "../../../../../coverage/libs/core/typescript/server/domain",
};
