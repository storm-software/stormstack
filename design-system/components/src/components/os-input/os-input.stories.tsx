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
Primary.args = {
  label: "Sample Label",
  name: "sample1",
  placeholder: "Placeholder",
};

/**
 * Information
 */
export const Information = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Information.args = {
  label: "Sample Label",
  name: "sample2",
  placeholder: "Placeholder",
  info: "This is an information message",
};

/**
 * Warning
 */
export const Warning = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Warning.args = {
  label: "Sample Label",
  name: "sample3",
  placeholder: "Placeholder",
};

/**
 * Error
 */
export const Error = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Error.args = {
  label: "Sample Label",
  name: "sample4",
  placeholder: "Placeholder",
};
