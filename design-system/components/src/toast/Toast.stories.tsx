/* eslint-disable @typescript-eslint/no-empty-function */
import type { ComponentStory } from "@storybook/react";
import { Toast } from "./Toast";
import { ToastVariants } from "./Toast.types";

export default {
  title: "Containers/Toast",
  component: Toast,
};

const Template: ComponentStory<typeof Toast> = args => (
  <Toast {...args} onClose={() => {}} />
);

export const Primary = Template.bind({});
Primary.args = {
  summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export const Warning = Template.bind({});
Warning.args = {
  summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: ToastVariants.WARNING,
};

export const Error = Template.bind({});
Error.args = {
  summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: ToastVariants.ERROR,
};

export const Info = Template.bind({});
Info.args = {
  summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: ToastVariants.INFO,
};

export const Success = Template.bind({});
Success.args = {
  summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: ToastVariants.SUCCESS,
};

export const LongMessage = Template.bind({});
LongMessage.args = {
  summary:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};

export const CloseIconDisplayed = Template.bind({});
CloseIconDisplayed.args = {
  showCloseIcon: true,
  summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};
