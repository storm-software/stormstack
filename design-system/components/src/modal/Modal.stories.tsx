import type { ComponentStory } from "@storybook/react";
import { Modal } from "./Modal";
import { ModalVariants } from "./Modal.types";

export default {
  title: "Containers/Modal",
  component: Modal,
};

const Template: ComponentStory<typeof Modal> = args => (
  <Modal {...args} initialOpened={true}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </Modal>
);

export const Primary = Template.bind({});
Primary.args = { title: "Modal Title" };

export const Warning = Template.bind({});
Warning.args = { title: "Modal Title", variant: ModalVariants.WARNING };

export const Error = Template.bind({});
Error.args = { title: "Modal Title", variant: ModalVariants.ERROR };

export const Info = Template.bind({});
Info.args = { title: "Modal Title", variant: ModalVariants.INFO };

export const Success = Template.bind({});
Success.args = { title: "Modal Title", variant: ModalVariants.SUCCESS };

export const PrimaryDefaultTitle = Template.bind({});
Primary.args = { variant: ModalVariants.PRIMARY };

export const WarningDefaultTitle = Template.bind({});
Warning.args = { variant: ModalVariants.WARNING };

export const ErrorDefaultTitle = Template.bind({});
Error.args = { variant: ModalVariants.ERROR };

export const InfoDefaultTitle = Template.bind({});
Info.args = { variant: ModalVariants.INFO };

export const SuccessDefaultTitle = Template.bind({});
Success.args = { variant: ModalVariants.SUCCESS };
