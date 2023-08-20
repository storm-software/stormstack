import type { ComponentStory } from "@storybook/react";
import { Spinner } from "./Spinner";
import { SpinnerVariants } from "./Spinner.types";

export default {
  title: "Loaders/Spinner",
  component: Spinner,
};

const Template: ComponentStory<typeof Spinner> = args => (
  <Spinner {...args} className="h-16 w-16" />
);

export const Primary = Template.bind({});
Primary.args = {};

export const Inverse = Template.bind({});
Inverse.args = { inverse: true };

export const Secondary = Template.bind({});
Secondary.args = { variant: SpinnerVariants.SECONDARY };

export const SecondaryInverse = Template.bind({});
SecondaryInverse.args = { variant: SpinnerVariants.SECONDARY, inverse: true };

export const Tertiary = Template.bind({});
Tertiary.args = { variant: SpinnerVariants.TERTIARY };

export const TertiaryInverse = Template.bind({});
TertiaryInverse.args = { variant: SpinnerVariants.TERTIARY, inverse: true };

export const Quarternary = Template.bind({});
Quarternary.args = { variant: SpinnerVariants.QUARTERNARY };

export const QuarternaryInverse = Template.bind({});
QuarternaryInverse.args = {
  variant: SpinnerVariants.QUARTERNARY,
  inverse: true,
};
