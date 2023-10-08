/* eslint-disable */
export default {
  displayName: "adapters-client-relay",
  preset: "../../../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: true },
          transform: { react: { runtime: "automatic" } }
        }
      }
    ]
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory:
    "../../../../../coverage/libs/adapters/typescript/client/relay"
};
