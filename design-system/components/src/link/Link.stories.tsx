import type { ComponentStory } from "@storybook/react";
import { Link } from "./Link";

export default {
  title: "General/Link",
  component: Link,
};

const Template: ComponentStory<typeof Link> = args => <Link>Lorem ipsum</Link>;

export const Primary = Template.bind({});
Primary.args = {};
