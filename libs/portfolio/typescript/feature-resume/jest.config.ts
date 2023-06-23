/* eslint-disable */
export default {
  displayName: "portfolio-feature-resume",
  preset: "../../../../testing/jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": [
      "@swc/jest",
      { jsc: { transform: { react: { runtime: "automatic" } } } },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory:
    "../../../../coverage/libs/portfolio/typescript/feature-resume",
};
