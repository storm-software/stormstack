/* eslint-disable */
export default {
  displayName: "common-server-events",
  preset: "../../../../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory:
    "../../../../../coverage/libs/common/typescript/server/events",
};
