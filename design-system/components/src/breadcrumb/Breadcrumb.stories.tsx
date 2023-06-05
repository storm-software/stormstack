import type { ComponentStory } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";
import { BreadcrumbVariants } from "./Breadcrumb.types";

export default {
  title: "General/Breadcrumb",
  component: Breadcrumb,
};

const Template: ComponentStory<typeof Breadcrumb> = args => (
  <Breadcrumb {...args}></Breadcrumb>
);

export const Primary = Template.bind({});
Primary.args = {
  variant: BreadcrumbVariants.PRIMARY,
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

export const Secondary = Template.bind({});
Secondary.args = {
  variant: BreadcrumbVariants.SECONDARY,
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

export const PrimaryInverse = Template.bind({});
PrimaryInverse.args = {
  variant: BreadcrumbVariants.PRIMARY,
  inverse: true,
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

export const SecondaryInverse = Template.bind({});
SecondaryInverse.args = {
  variant: BreadcrumbVariants.SECONDARY,
  inverse: true,
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
