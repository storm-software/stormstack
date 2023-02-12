import type { ComponentStory } from "@storybook/react";
import { InfoMessage } from "./InfoMessage";
import { InfoMessageVariants } from "./InfoMessage.types";

export default {
  title: "Icons/InfoMessage",
  component: InfoMessage,
};

const Template: ComponentStory<typeof InfoMessage> = args => (
  <InfoMessage {...args}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </InfoMessage>
);

export const Primary = Template.bind({});
Primary.args = {};

export const Warning = Template.bind({});
Warning.args = { variant: InfoMessageVariants.WARNING };

export const Error = Template.bind({});
Error.args = { variant: InfoMessageVariants.ERROR };

export const Info = Template.bind({});
Info.args = { variant: InfoMessageVariants.INFO };

export const Success = Template.bind({});
Success.args = { variant: InfoMessageVariants.SUCCESS };

export const Opened = Template.bind({});
Opened.args = { opened: true };
