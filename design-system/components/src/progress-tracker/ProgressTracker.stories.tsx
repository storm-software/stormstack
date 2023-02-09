import type { ComponentStory } from "@storybook/react";
import { ProgressTracker } from "./ProgressTracker";
import { ProgressTrackerItemStatus } from "./ProgressTracker.types";

export default {
  title: "General/ProgressTracker",
  component: ProgressTracker,
};

const Template: ComponentStory<typeof ProgressTracker> = args => (
  <ProgressTracker {...args}></ProgressTracker>
);

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      name: "reason",
      label: "Reason",
      status: ProgressTrackerItemStatus.COMPLETE,
      onClick: () => {},
    },
    {
      name: "personal-info",
      label: "Personal Info.",
      status: ProgressTrackerItemStatus.COMPLETE,
      onClick: () => {},
    },
    {
      name: "details",
      label: "Details",
      status: ProgressTrackerItemStatus.ACTIVE,
      onClick: () => {},
    },
    {
      name: "summary",
      label: "Summary",
      status: ProgressTrackerItemStatus.PENDING,
      onClick: () => {},
    },
    {
      name: "final",
      label: "Final",
      status: ProgressTrackerItemStatus.PENDING,
      onClick: () => {},
    },
  ],
};
