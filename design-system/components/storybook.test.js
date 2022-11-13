import initStoryshots from "@storybook/addon-storyshots";
import path from "path";

initStoryshots({
  framework: "web-components",
  configPath: path.join(__dirname, ".storybook"),
  integrityOptions: { cwd: path.join(__dirname, "src", "components") },
});
