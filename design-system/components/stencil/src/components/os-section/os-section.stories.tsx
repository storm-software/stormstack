import { OsSection } from "@open-system/design-system-components/os-section";
import { h } from "@stencil/core";

export default {
  title: "Containers/Section",
  component: OsSection,
};

const Template = args => (
  <os-section {...args}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </os-section>
);

export const Primary = Template.bind({});
Primary.args = {
  header: "Header Text",
};
