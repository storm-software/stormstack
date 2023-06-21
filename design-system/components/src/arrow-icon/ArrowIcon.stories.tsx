import type { ComponentStory } from "@storybook/react";
import { ArrowIcon } from "./ArrowIcon";

export default {
  title: "Icons/ArrowIcon",
  component: ArrowIcon,
};

const Template: ComponentStory<typeof ArrowIcon> = args => (
  <ArrowIcon {...args} className="h-60 w-60"></ArrowIcon>
);

export const Primary = Template.bind({});
Primary.args = {};
