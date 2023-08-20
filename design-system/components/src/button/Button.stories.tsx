import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { Button } from "./Button";
import { ButtonCornerRoundingTypes } from "./Button.types";

const Story: ComponentMeta<typeof Button> = {
  component: Button,
  title: "General/Button",
};
export default Story;

const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

/**
 * Primary
 */
export const Primary = Template.bind({});
Primary.args = { variant: "primary" };

/**
 * Secondary
 */
export const Secondary = Template.bind({});
Secondary.args = { variant: "secondary" };

/**
 * Tertiary
 */
export const Tertiary = Template.bind({});
Tertiary.args = { variant: "tertiary" };

/**
 * Quaternary
 */
export const Quaternary = Template.bind({});
Quaternary.args = { variant: "quaternary" };

/**
 * Gradient
 */
export const Gradient = Template.bind({});
Gradient.args = { variant: "gradient" };

/**
 * Left
 */
export const Left = Template.bind({});
Left.args = { transitionDirection: "left" };

/**
 * Right
 */
export const Right = Template.bind({});
Right.args = { transitionDirection: "right" };

/**
 * Top
 */
export const Top = Template.bind({});
Top.args = { transitionDirection: "top" };

/**
 * Bottom
 */
export const Bottom = Template.bind({});
Bottom.args = { transitionDirection: "bottom" };

/**
 * Bottom - Secondary
 */
export const BottomSecondary = Template.bind({});
BottomSecondary.args = { transitionDirection: "bottom", variant: "secondary" };

/**
 * Bottom - Tertiary
 */
export const BottomTertiary = Template.bind({});
BottomTertiary.args = { transitionDirection: "bottom", variant: "tertiary" };

/**
 * Bottom - Gradient
 */
export const BottomGradient = Template.bind({});
BottomGradient.args = { transitionDirection: "bottom", variant: "gradient" };

/**
 * None
 */
export const None = Template.bind({});
None.args = { transitionDirection: "none" };

/**
 * None - Secondary
 */
export const NoneSecondary = Template.bind({});
NoneSecondary.args = { transitionDirection: "none", variant: "secondary" };

/**
 * None - Tertiary
 */
export const NoneTertiary = Template.bind({});
NoneTertiary.args = { transitionDirection: "none", variant: "tertiary" };

/**
 * None - Gradient
 */
export const NoneGradient = Template.bind({});
NoneGradient.args = { transitionDirection: "none", variant: "gradient" };

/**
 * None
 */
export const NoneInverse = Template.bind({});
NoneInverse.args = { transitionDirection: "none", inverse: true };

/**
 * None - Secondary
 */
export const NoneSecondaryInverse = Template.bind({});
NoneSecondaryInverse.args = {
  transitionDirection: "none",
  variant: "secondary",
  inverse: true,
};

/**
 * None - Tertiary
 */
export const NoneTertiaryInverse = Template.bind({});
NoneTertiaryInverse.args = {
  transitionDirection: "none",
  variant: "tertiary",
  inverse: true,
};

/**
 * None - Gradient
 */
export const NoneGradientInverse = Template.bind({});
NoneGradientInverse.args = {
  transitionDirection: "none",
  variant: "gradient",
  inverse: true,
};

const InverseTemplate: ComponentStory<typeof Button> = args => (
  <Button {...args}>Btn Text</Button>
);

/**
 * Inverse Left
 */
export const InverseLeft = InverseTemplate.bind({});
InverseLeft.args = { inverse: true, transitionDirection: "left" };

/**
 * Inverse Right
 */
export const InverseRight = InverseTemplate.bind({});
InverseRight.args = { inverse: true, transitionDirection: "right" };

/**
 * Inverse Top
 */
export const InverseTop = InverseTemplate.bind({});
InverseTop.args = { inverse: true, transitionDirection: "top" };

/**
 * Inverse Bottom
 */
export const InverseBottom = InverseTemplate.bind({});
InverseBottom.args = { inverse: true, transitionDirection: "bottom" };

/**
 * Button Type
 */
export const ButtonType = Template.bind({});
ButtonType.args = { type: "button" };

/**
 * Reset Type
 */
export const ResetType = Template.bind({});
ResetType.args = { type: "reset" };

/**
 * Submit Type
 */
export const SubmitType = Template.bind({});
SubmitType.args = { type: "submit" };

/**
 * Disabled
 */
export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

/**
 * Disabled Secondary
 */
export const DisabledSecondary = Template.bind({});
DisabledSecondary.args = { disabled: true, variant: "secondary" };

/**
 * Disabled Tertiary
 */
export const DisabledTertiary = Template.bind({});
DisabledTertiary.args = { disabled: true, variant: "tertiary" };

/**
 * Disabled Gradient
 */

export const DisabledGradient = Template.bind({});
DisabledGradient.args = { disabled: true, variant: "gradient" };

/**
 * Disabled Inverse
 */
export const DisabledInverse = Template.bind({});
DisabledInverse.args = { disabled: true, inverse: true };

/**
 * Disabled Secondary Inverse
 */
export const DisabledSecondaryInverse = Template.bind({});
DisabledSecondaryInverse.args = {
  disabled: true,
  variant: "secondary",
  inverse: true,
};

/**
 * Disabled Tertiary Inverse
 */
export const DisabledTertiaryInverse = Template.bind({});
DisabledTertiaryInverse.args = {
  disabled: true,
  variant: "tertiary",
  inverse: true,
};

/**
 * Disabled Gradient Inverse
 */
export const DisabledGradientInverse = Template.bind({});
DisabledGradientInverse.args = {
  disabled: true,
  variant: "gradient",
  inverse: true,
};

/**
 * No Rounding
 */
export const NoRounding = Template.bind({});
NoRounding.args = { rounding: ButtonCornerRoundingTypes.NONE };

/**
 * Partial Rounding
 */
export const PartialRounding = Template.bind({});
PartialRounding.args = { rounding: ButtonCornerRoundingTypes.PARTIAL };

/**
 * Full Rounding
 */
export const FullRounding = Template.bind({});
FullRounding.args = { rounding: ButtonCornerRoundingTypes.FULL };

/**
 * CustomText
 */
const CustomTextTemplate: ComponentStory<typeof Button> = args => (
  <Button {...args}>{args.children}</Button>
);

export const CustomText = CustomTextTemplate.bind({});
CustomText.args = { children: "Hello", hoverText: "World" };
