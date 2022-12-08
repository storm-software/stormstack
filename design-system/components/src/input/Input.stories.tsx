import type { ComponentStory } from "@storybook/react";
import { FieldReference } from "../types";
import { Input } from "./Input";

export default {
  title: "Forms/Input",
  component: Input,
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
const Template: ComponentStory<typeof Input> = args => (
  <Input {...args}></Input>
);

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
const WarningTemplate: ComponentStory<typeof Input> = args => (
  <Input
    ref={(el: FieldReference<string>) => (warningRef = el)}
    {...args}></Input>
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
const ErrorTemplate: ComponentStory<typeof Input> = args => (
  <Input
    ref={(el: FieldReference<string>) => (errorRef = el)}
    {...args}></Input>
);

export const Error = ErrorTemplate.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Error.args = {
  label: "Sample Label",
  name: "sample",
};
console.log(errorRef);
//errorRef.setError("This is an error message");
