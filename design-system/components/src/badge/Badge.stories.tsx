import type { ComponentStory } from "@storybook/react";
import { Badge } from "./Badge";
import { BadgeBorderThickness, BadgeVariants } from "./Badge.types";

export default {
  title: "General/Badge",
  component: Badge,
};

const Template: ComponentStory<typeof Badge> = args => (
  <Badge {...args}>Updated</Badge>
);

export const Primary = Template.bind({});
Primary.args = { variant: BadgeVariants.PRIMARY };

export const Secondary = Template.bind({});
Secondary.args = { variant: BadgeVariants.SECONDARY };

export const Tertiary = Template.bind({});
Tertiary.args = { variant: BadgeVariants.TERTIARY };

export const Quaternary = Template.bind({});
Quaternary.args = { variant: BadgeVariants.QUATERNARY };

export const Inverse = Template.bind({});
Inverse.args = { variant: BadgeVariants.INVERSE };

export const Warning = Template.bind({});
Warning.args = { variant: BadgeVariants.WARNING };

export const Error = Template.bind({});
Error.args = { variant: BadgeVariants.ERROR };

export const Info = Template.bind({});
Info.args = { variant: BadgeVariants.INFO };

export const Success = Template.bind({});
Success.args = { variant: BadgeVariants.SUCCESS };

export const Gradient = Template.bind({});
Gradient.args = { variant: BadgeVariants.GRADIENT };

export const NoBorder = Template.bind({});
NoBorder.args = {
  variant: BadgeVariants.SECONDARY,
  borderThickness: BadgeBorderThickness.NONE,
};

export const ThinBorder = Template.bind({});
ThinBorder.args = {
  variant: BadgeVariants.SECONDARY,
  borderThickness: BadgeBorderThickness.THIN,
};

export const NormalBorder = Template.bind({});
NormalBorder.args = {
  variant: BadgeVariants.SECONDARY,
  borderThickness: BadgeBorderThickness.NORMAL,
};

export const ThickBorder = Template.bind({});
ThickBorder.args = {
  variant: BadgeVariants.SECONDARY,
  borderThickness: BadgeBorderThickness.THICK,
};

export const CustomBorderColor = Template.bind({});
CustomBorderColor.args = {
  variant: BadgeVariants.SECONDARY,
  borderThickness: BadgeBorderThickness.NORMAL,
  borderColorClassName: "border-slate-300",
};

export const OnClickAnimate = Template.bind({});
OnClickAnimate.args = { variant: BadgeVariants.SECONDARY, onClick: () => {} };
