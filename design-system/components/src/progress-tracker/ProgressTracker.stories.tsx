import type { ComponentStory } from "@storybook/react";
import { ProgressTracker } from "./ProgressTracker";

export default {
  title: "General/ProgressTracker",
  component: ProgressTracker,
};

const Template: ComponentStory<typeof ProgressTracker> = args => (
  <ProgressTracker {...args}></ProgressTracker>
);

export const Primary = Template.bind({});
Primary.args = {};
