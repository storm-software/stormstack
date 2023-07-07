/* eslint-disable */
export default {
  displayName: "user-management-server-data-access",
  preset: "../../../../../testing/jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": [
      "@swc/jest",
      { jsc: { transform: { react: { runtime: "automatic" } } } },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory:
    "../../../../../coverage/libs/user-management/typescript/server/data-access",
};
