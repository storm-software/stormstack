import { OsButton } from "@open-system/design-system-components/os-button";
import { h } from "@stencil/core";

export default {
  title: "Button",
  component: OsButton,
};

const Template = args => <os-button {...args}>My button Text</os-button>;

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

const InverseTemplate = args => <os-button {...args}>My button Text</os-button>;

/**
 * Inverse Left
 */
export const InverseLeft = InverseTemplate.bind({});
InverseLeft.args = { isInverse: true, transitionDirection: "left" };

/**
 * Inverse Right
 */
export const InverseRight = InverseTemplate.bind({});
InverseRight.args = { isInverse: true, transitionDirection: "right" };

/**
 * Inverse Top
 */
export const InverseTop = InverseTemplate.bind({});
InverseTop.args = { isInverse: true, transitionDirection: "top" };

/**
 * Inverse Bottom
 */
export const InverseBottom = InverseTemplate.bind({});
InverseBottom.args = { isInverse: true, transitionDirection: "bottom" };

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
 * CustomText
 */
const CustomTextTemplate = args => (
  <os-button {...args}>
    {args.text}
    <div slot="hover-text">{args.hoverText}</div>
  </os-button>
);

export const CustomText = CustomTextTemplate.bind({});
CustomText.args = { text: "Hello", hoverText: "World" };
