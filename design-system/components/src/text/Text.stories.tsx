import type { ComponentStory } from "@storybook/react";
import { FieldText } from "./text";

export default {
  title: "General/Text",
  component: FieldText,
};

const Template: ComponentStory<typeof FieldText> = args => (
  <FieldText {...args}>Lorem ipsum</FieldText>
);

export const Primary = Template.bind({});
Primary.args = {};

export const WithName = Template.bind({});
WithName.args = { name: "Field Name" };
