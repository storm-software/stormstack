/* eslint-disable */
export default {
  displayName: "contact-server-graphql",
  preset: "../../../../../testing/jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory:
    "../../../../../coverage/libs/contact/typescript/server/graphql",
};
