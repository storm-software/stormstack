import type { ComponentStory } from "@storybook/react";
import { Card } from "./Card";

export default {
  title: "Containers/Card",
  component: Card,
};

const Template: ComponentStory<typeof Card> = args => (
  <Card {...args}>
    <p className="text-primary">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  </Card>
);

export const Primary = Template.bind({});
Primary.args = { title: "Summary Header" };

export const Details = Template.bind({});
Details.args = { title: "Summary Header", details: "Detail Text" };
