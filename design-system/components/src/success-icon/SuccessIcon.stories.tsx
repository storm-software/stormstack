import type { ComponentStory } from "@storybook/react";
import { SuccessIcon } from "./SuccessIcon";

export default {
  title: "Icons/SuccessIcon",
  component: SuccessIcon,
};

const Template: ComponentStory<typeof SuccessIcon> = args => (
  <SuccessIcon {...args}></SuccessIcon>
);

export const Primary = Template.bind({});
Primary.args = {};
