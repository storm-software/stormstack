/* eslint-disable */
export default {
  displayName: "user-management-client-data-access",
  preset: "../../../../../testing/jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": [
      "@swc/jest",
      { jsc: { transform: { react: { runtime: "automatic" } } } },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory:
    "../../../../../coverage/libs/user-management/typescript/client/data-access",
};
