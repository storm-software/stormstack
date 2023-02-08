import type { ComponentStory } from "@storybook/react";
import { Radio } from "./Radio";
import { RadioOption } from "./RadioOption";

export default {
  title: "Forms/Radio",
  component: Radio,
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
const Template: ComponentStory<typeof Radio> = args => (
  <Radio {...args}>
    <RadioOption name="Option 1" value="option1" />
    <RadioOption name="Option 2" value="option2" />
    <RadioOption name="Option 3" value="option3" />
  </Radio>
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
 * Vertical
 */
export const Vertical = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Vertical.args = {
  label: "Sample Label",
  name: "sample",
  isVertical: true,
};

/**
 * No Label
 */
export const NoLabel = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
NoLabel.args = {
  label: null,
  name: "sample",
  isVertical: true,
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
