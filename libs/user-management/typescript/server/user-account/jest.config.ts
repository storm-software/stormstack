/* eslint-disable */
export default {
  displayName: "user-management-server-user-account",
  preset: "../../../../../testing/jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory:
    "../../../../../coverage/libs/user-management/typescript/server/user-account",
};
