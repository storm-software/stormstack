/* eslint-disable */
export default {
  displayName: "tools-async-api-rabbitmq",
  preset: "../../../testing/jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../../coverage/tools/async-api/rabbitmq",
};
