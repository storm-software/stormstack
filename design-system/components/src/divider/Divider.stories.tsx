import type { ComponentStory } from "@storybook/react";
import { Divider } from "./Divider";
import {
  DividerDirections,
  DividerSizes,
  DividerVariants,
} from "./Divider.types";

export default {
  title: "General/Divider",
  component: Divider,
};

const Template: ComponentStory<typeof Divider> = args => (
  <Divider {...args}></Divider>
);

export const Primary = Template.bind({});
Primary.args = { variant: DividerVariants.PRIMARY };

export const Secondary = Template.bind({});
Secondary.args = { variant: DividerVariants.SECONDARY };

export const Tertiary = Template.bind({});
Tertiary.args = { variant: DividerVariants.TERTIARY };

export const Gradient = Template.bind({});
Gradient.args = { variant: DividerVariants.GRADIENT };

export const Small = Template.bind({});
Small.args = { size: DividerSizes.SMALL };

export const Medium = Template.bind({});
Medium.args = { size: DividerSizes.MEDIUM };

export const Large = Template.bind({});
Large.args = { size: DividerSizes.LARGE };

export const Horizontal = Template.bind({});
Horizontal.args = { direction: DividerDirections.HORIZONTAL };

const VerticalTemplate: ComponentStory<typeof Divider> = args => (
  <div className="h-20">
    <Divider {...args}></Divider>
  </div>
);

export const Vertical = VerticalTemplate.bind({});
Vertical.args = { direction: DividerDirections.VERTICAL };
