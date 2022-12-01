import { OsLink } from "@open-system/design-system-components/os-link";
import { h } from "@stencil/core";

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
Primary.args = { label: "Contact" };
