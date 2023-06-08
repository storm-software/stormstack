/* eslint-disable */
export default {
  displayName: "engagement-feature-rating",
  preset: "../../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": [
      "@swc/jest",
      { jsc: { transform: { react: { runtime: "automatic" } } } },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory:
    "../../../../coverage/libs/engagement/typescript/feature-rating",
};
