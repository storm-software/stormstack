// jest.setup.js <-- this will run before the tests in jest.
import { setGlobalConfig } from "@storybook/testing-react";
import * as globalStorybookConfig from "./.storybook/preview"; // path of your preview.js file

setGlobalConfig(globalStorybookConfig);
