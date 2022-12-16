import type { ComponentStory } from "@storybook/react";
import { Link } from "./Link";
import { LinkVariants } from "./Link.types";

export default {
  title: "General/Link",
  component: Link,
};

const Template: ComponentStory<typeof Link> = args => (
  <Link {...args}>Lorem ipsum</Link>
);

export const Primary = Template.bind({});
Primary.args = {};

export const Secondary = Template.bind({});
Secondary.args = { variant: LinkVariants.SECONDARY };

export const Tertiary = Template.bind({});
Tertiary.args = { variant: LinkVariants.TERTIARY };
