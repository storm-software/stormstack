// jest.setup.js <-- this will run before the tests in jest.
import initStoryshots from "@storybook/addon-storyshots";
import { setGlobalConfig } from "@storybook/testing-react";
import path from "path";
import * as globalStorybookConfig from "./.storybook/preview"; // path of your preview.js file

setGlobalConfig(globalStorybookConfig);
initStoryshots({
  framework: "web-components",
  configPath: path.join(__dirname, ".storybook"),
  integrityOptions: { cwd: path.join(__dirname, "src", "components") },
});
