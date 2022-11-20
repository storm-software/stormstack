import { OsTitle } from "@open-system/design-system-components/os-title";
import { h } from "@stencil/core";

export default {
  title: "Title",
  component: OsTitle,
};

const Template = args => <os-title {...args}></os-title>;

export const Primary = Template.bind({});
Primary.args = { first: "Hello", last: "World" };
