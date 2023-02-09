import type { ComponentStory } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

export default {
  title: "General/Breadcrumb",
  component: Breadcrumb,
};

const Template: ComponentStory<typeof Breadcrumb> = args => (
  <Breadcrumb {...args}></Breadcrumb>
);

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      name: "contact",
      label: "Contact",
      onClick: () => {},
    },
    {
      name: "business",
      label: "Business Opportunity",
      onClick: () => {},
    },
    {
      name: "summary",
      label: "Summary",
      onClick: () => {},
    },
  ],
};

export const OneItem = Template.bind({});
OneItem.args = {
  items: [
    {
      name: "contact",
      label: "Contact",
      onClick: () => {},
    },
  ],
};
