import type { ComponentStory } from "@storybook/react";
import { FieldText } from "./FieldText";

export default {
  title: "General/FieldText",
  component: FieldText,
};

const Template: ComponentStory<typeof FieldText> = args => (
  <FieldText {...args}>Lorem ipsum</FieldText>
);

export const Primary = Template.bind({});
Primary.args = {};

export const WithName = Template.bind({});
WithName.args = { name: "Field Name" };
