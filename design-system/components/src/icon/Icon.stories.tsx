import type { ComponentStory } from "@storybook/react";
import { Icon } from "./Icon";

export default {
  title: "Icons/Icon",
  component: Icon,
};

const Template: ComponentStory<typeof Icon> = args => (
  <Icon {...args}></Icon>
);

export const Primary = Template.bind({});
Primary.args = {};
