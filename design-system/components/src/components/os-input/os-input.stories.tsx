import { h } from "@stencil/core";
import { OsInput } from "./os-input";

export default {
  title: "Forms/Input",
  component: OsInput,
  parameters: {
    label: [
      { name: "Label", value: "Label" },
      { name: "Sample Label", value: "Sample Label" },
    ],
    placeholder: [
      { name: "Placeholder", value: "Placeholder" },
      { name: "Sample Placeholder", value: "Sample Placeholder" },
    ],
  },
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
  name: "sample",
};

/**
 * Placeholder
 */
export const Placeholder = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Placeholder.args = {
  label: "Sample Label",
  name: "sample",
  placeholder: "Sample Placeholder",
};

/**
 * Required
 */
export const Required = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Required.args = {
  label: "Sample Label",
  name: "sample",
  required: true,
};

/**
 * Disabled
 */
export const Disabled = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Disabled.args = {
  label: "Sample Label",
  name: "sample",
  disabled: true,
};

/**
 * Information
 */
export const Information = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Information.args = {
  label: "Sample Label",
  name: "sample",
  info: "This is an information message",
};

/**
 * Warning
 */
let warningRef;
const WarningTemplate = args => (
  <os-input
    ref={(el: HTMLInputElement) => (warningRef = el)}
    {...args}></os-input>
);

export const Warning = WarningTemplate.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Warning.args = {
  label: "Sample Label",
  name: "sample",
};
console.log(warningRef);
//warningRef.setWarning("This is a warning message");

/**
 * Error
 */
let errorRef;
const ErrorTemplate = args => (
  <os-input
    ref={(el: HTMLInputElement) => (errorRef = el)}
    {...args}></os-input>
);

export const Error = ErrorTemplate.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Error.args = {
  label: "Sample Label",
  name: "sample",
};
console.log(errorRef);
//errorRef.setError("This is an error message");
