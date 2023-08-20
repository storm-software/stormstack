import type { ComponentStory } from "@storybook/react";
import { Skeleton } from "./Skeleton";

export default {
  title: "Loaders/Skeleton",
  component: Skeleton,
};

const PrimaryTemplate: ComponentStory<typeof Skeleton> = args => (
  <div className="flex w-96 flex-col gap-3">
    <Skeleton {...args} />
    <div className="flex flex-row gap-3">
      <Skeleton {...args} className="basis-1/3" />
      <Skeleton {...args} className="basis-2/3" />
    </div>
    <Skeleton {...args} />
  </div>
);

export const Primary = PrimaryTemplate.bind({});
Primary.args = {};

const RoundedTemplate: ComponentStory<typeof Skeleton> = args => (
  <div className="flex flex-row w-96 items-center gap-3">
    <div className="max-h-fit max-w-fit">
      <Skeleton {...args} />
    </div>
    <div className="flex w-full flex-col gap-3">
      <Skeleton />
      <div className="flex flex-row gap-3">
        <Skeleton className="basis-1/3" />
        <Skeleton className="basis-2/3" />
      </div>
      <Skeleton />
    </div>
  </div>
);

export const Rounded = RoundedTemplate.bind({});
Rounded.args = { isCircle: true, className: "h-24 w-24" };
