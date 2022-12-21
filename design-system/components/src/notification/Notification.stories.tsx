import type { ComponentStory } from "@storybook/react";
import { Notification } from "./Notification";
import { NotificationVariants } from "./Notification.types";

export default {
  title: "Containers/Notification",
  component: Notification,
};

const Template: ComponentStory<typeof Notification> = args => (
  <Notification {...args} initialOpened={true} />
);

export const Primary = Template.bind({});
Primary.args = {
  notification: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export const Warning = Template.bind({});
Warning.args = {
  notification: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: NotificationVariants.WARNING,
};

export const Error = Template.bind({});
Error.args = {
  notification: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: NotificationVariants.ERROR,
};

export const Info = Template.bind({});
Info.args = {
  notification: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: NotificationVariants.INFO,
};

export const Success = Template.bind({});
Success.args = {
  notification: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  variant: NotificationVariants.SUCCESS,
};

export const LongNotification = Template.bind({});
LongNotification.args = {
  notification:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};
