import { OsInput } from "@open-system/design-system-components/os-input";
import { h } from "@stencil/core";

export default {
  title: "Input",
  component: OsInput,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = args => <os-input {...args}></os-input>;

/**
 * Primary
 */
export const Primary = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { first: "Hello", last: "World" };
