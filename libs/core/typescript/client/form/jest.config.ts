/* eslint-disable */
export default {
  displayName: "core-client-form",
  preset: "../../../../../testing/jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": [
      "@swc/jest",
      { jsc: { transform: { react: { runtime: "automatic" } } } },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../../../../coverage/libs/core/typescript/client/form",
};
