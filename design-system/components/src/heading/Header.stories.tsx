import type { ComponentStory } from "@storybook/react";
import { Heading } from "./Heading";

export default {
  title: "General/Heading",
  component: Heading,
};

const Template: ComponentStory<typeof Heading> = args => (
  <Heading {...args}>Heading Text</Heading>
);

export const Primary = Template.bind({});
Primary.args = {};
