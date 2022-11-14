import { h } from "@stencil/core";
import { OsLink } from "./os-link";

export default {
  title: "Link",
  component: OsLink,
};

const Template = args => (
  <div class="w-[400px]">
    <os-link {...args}></os-link>
  </div>
);

export const Primary = Template.bind({});
Primary.args = { text: "Contact", last: "World" };
