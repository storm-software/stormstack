import type { ComponentStory } from "@storybook/react";
import { SuccessIcon } from "./SuccessIcon";

export default {
  title: "Icons/SuccessIcon",
  component: SuccessIcon,
};

const Template: ComponentStory<typeof SuccessIcon> = args => (
  <SuccessIcon {...args} className="h-60 w-60"></SuccessIcon>
);

export const Primary = Template.bind({});
Primary.args = {};
