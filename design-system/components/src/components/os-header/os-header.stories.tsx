import { OsHeader } from "@open-system/design-system-components/os-header";
import { h } from "@stencil/core";

export default {
  title: "OsHeader",
  component: OsHeader,
};

const Template = args => <os-header {...args}>Header Text</os-header>;

export const Primary = Template.bind({});
Primary.args = {};
