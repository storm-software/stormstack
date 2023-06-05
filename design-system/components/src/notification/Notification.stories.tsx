/* eslint-disable @typescript-eslint/no-empty-function */
import type { ComponentStory } from "@storybook/react";
import { Notification } from "./Notification";
import { NotificationVariants } from "./Notification.types";
import { Link, LinkVariants } from "../link";

export default {
  title: "Containers/Notification",
  component: Notification,
};

const Template: ComponentStory<typeof Notification> = args => (
  <Notification {...args} onClose={() => {}} />
);

export const Primary = Template.bind({});
Primary.args = {
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export const Warning = Template.bind({});
Warning.args = {
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: NotificationVariants.WARNING,
};

export const Error = Template.bind({});
Error.args = {
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: NotificationVariants.ERROR,
};

export const Info = Template.bind({});
Info.args = {
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: NotificationVariants.INFO,
};

export const Success = Template.bind({});
Success.args = {
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: NotificationVariants.SUCCESS,
};

export const LongMessage = Template.bind({});
LongMessage.args = {
  body:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};

export const CloseIconDisplayed = Template.bind({});
CloseIconDisplayed.args = {
  showCloseIcon: true,
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export const WithActions = Template.bind({});
WithActions.args = {
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  actions: <div className="flex flex-row-reverse w-full gap-6 mt-3"><Link variant={LinkVariants.PRIMARY}>View Item</Link></div>,
};