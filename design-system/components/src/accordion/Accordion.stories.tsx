import type { ComponentStory } from "@storybook/react";
import { Accordion } from "./Accordion";

export default {
  title: "Containers/Accordion",
  component: Accordion,
};

const Template: ComponentStory<typeof Accordion> = args => (
  <Accordion {...args}>
    <p className="text-primary">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  </Accordion>
);

export const Primary = Template.bind({});
Primary.args = { summary: "Summary Header" };

export const Opened = Template.bind({});
Opened.args = { summary: "Summary Header", opened: true };

export const Closed = Template.bind({});
Closed.args = { summary: "Summary Header", opened: false };

export const Details = Template.bind({});
Details.args = { summary: "Summary Header", details: "Detail Text" };
