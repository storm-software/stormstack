/* eslint-disable */
export default {
  displayName: "worker-contact-attachments-upload",
  preset: "../../../testing/jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": [
      "@swc/jest",
      { jsc: { transform: { react: { runtime: "automatic" } } } },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory:
    "../../../coverage/apps/workers/contact-attachments-upload",
};
