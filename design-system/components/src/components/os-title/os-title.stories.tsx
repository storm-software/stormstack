import { h } from "@stencil/core";
import { OsTitle } from "./os-title";

export default {
  title: "Title",
  component: OsTitle,
};

const Template = args => <os-title {...args}></os-title>;

export const Primary = Template.bind({});
Primary.args = { first: "Hello", last: "World" };
