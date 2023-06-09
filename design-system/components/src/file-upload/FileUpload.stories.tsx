import type { ComponentStory } from "@storybook/react";
import { FieldReference } from "../types";
import { FileUpload } from "./FileUpload";

export default {
  title: "Forms/FileUpload",
  component: FileUpload,
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
const Template: ComponentStory<typeof FileUpload> = args => (
  <FileUpload className="h-40" {...args}></FileUpload>
);

/**
 * Primary
 */
export const Primary = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  name: "sample",
};

/**
 * Label
 */
export const Label = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Label.args = {
  label: "Sample Label",
  name: "sample",
};

/**
 * Required
 */
export const Required = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Required.args = {
  name: "sample",
  required: true,
};

/**
 * Required with Label
 */
export const RequiredWithLabel = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
RequiredWithLabel.args = {
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
const WarningTemplate: ComponentStory<typeof FileUpload> = args => (
  <FileUpload
    ref={(el: FieldReference<string>) => (warningRef = el)}
    {...args}></FileUpload>
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
const ErrorTemplate: ComponentStory<typeof FileUpload> = args => (
  <FileUpload
    ref={(el: FieldReference<string>) => (errorRef = el)}
    {...args}></FileUpload>
);

export const Error = ErrorTemplate.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Error.args = {
  label: "Sample Label",
  name: "sample",
};
console.log(errorRef);
//errorRef.setError("This is an error message");
