import type { ComponentStory } from "@storybook/react";
import { Rating } from "./Rating";
import { RatingOption } from "./RatingOption";

export default {
  title: "Forms/Rating",
  component: Rating,
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
const Template: ComponentStory<typeof Rating> = args => (
  <div className="ml-20">
    <Rating {...args}>   
      <RatingOption name="1" value={1} /> 
      <RatingOption name="2" value={2} />
      <RatingOption name="3" value={3} />
      <RatingOption name="4" value={4} />
      <RatingOption name="5" value={5} />    
    </Rating>
  </div>
);

/**
 * Primary
 */
export const Primary = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: "Sample Label",
  name: "sample",
  value: 3,
};

/**
 * Vertical
 */
export const Vertical = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Vertical.args = {
  label: "Sample Label",
  name: "sample",
  value: 3,
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
  value: 3,
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
  value: 3,
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
  value: 3,
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
  value: 3,
  info: "This is an information message",
};

/**
 * Partial Rating
 */
export const PartialRating = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
PartialRating.args = {
  label: "Sample Label",
  name: "sample",
  value: 3.5,
  isVertical: true,
};