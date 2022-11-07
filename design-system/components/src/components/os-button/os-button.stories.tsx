import { OsButton } from "@open-system/design-system-components/os-button";
import { h } from "@stencil/core";

export default {
  title: "Button",
  component: OsButton,
};

const Template = args => <os-button {...args}></os-button>;

export const Primary = Template.bind({});
Primary.args = { first: "Hello", last: "World" };
