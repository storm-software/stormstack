/* eslint-disable @typescript-eslint/no-empty-function */
import type { ComponentStory } from "@storybook/react";
import { MessageBar } from "./MessageBar";
import { MessageBarVariants } from "./MessageBar.types";

export default {
  title: "Containers/MessageBar",
  component: MessageBar,
};

const Template: ComponentStory<typeof MessageBar> = args => (
  <MessageBar {...args} onClose={() => {}} />
);

export const Primary = Template.bind({});
Primary.args = {
  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export const Warning = Template.bind({});
Warning.args = {
  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: MessageBarVariants.WARNING,
};

export const Error = Template.bind({});
Error.args = {
  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: MessageBarVariants.ERROR,
};

export const Info = Template.bind({});
Info.args = {
  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: MessageBarVariants.INFO,
};

export const Success = Template.bind({});
Success.args = {
  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: MessageBarVariants.SUCCESS,
};

export const LongMessage = Template.bind({});
LongMessage.args = {
  message:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};

export const CloseIconDisplayed = Template.bind({});
CloseIconDisplayed.args = {
  showCloseIcon: true,
  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};
