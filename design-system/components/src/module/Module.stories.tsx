import type { ComponentStory } from "@storybook/react";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants,
} from "../button";
import { Module } from "./Module";

export default {
  title: "Containers/Module",
  component: Module,
};

const Template: ComponentStory<typeof Module> = args => (
  <Module {...args}>
    <p className="text-primary">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  </Module>
);

export const Primary = Template.bind({});
Primary.args = {
  header: "Header Text",
  footer: (
    <div className="flex w-full flex-row-reverse justify-between">
      <Button
        variant={ButtonVariants.SECONDARY}
        rounding={ButtonCornerRoundingTypes.PARTIAL}
        transitionDirection={ButtonTransitionDirections.TOP}
        hoverText="Continue">
        Continue
      </Button>
      <Button
        variant={ButtonVariants.TERTIARY}
        type={ButtonTypes.RESET}
        rounding={ButtonCornerRoundingTypes.PARTIAL}
        transitionDirection={ButtonTransitionDirections.TOP}
        hoverText="Reset">
        Reset
      </Button>
    </div>
  ),
};

export const Body = Template.bind({});
Body.args = {};

export const Header = Template.bind({});
Header.args = { header: "Header Text" };

export const Footer = Template.bind({});
Footer.args = {
  footer: (
    <div className="flex w-full flex-row-reverse justify-between">
      <Button
        variant={ButtonVariants.SECONDARY}
        rounding={ButtonCornerRoundingTypes.PARTIAL}
        transitionDirection={ButtonTransitionDirections.TOP}
        hoverText="Continue">
        Continue
      </Button>
      <Button
        variant={ButtonVariants.TERTIARY}
        type={ButtonTypes.RESET}
        rounding={ButtonCornerRoundingTypes.PARTIAL}
        transitionDirection={ButtonTransitionDirections.TOP}
        hoverText="Reset">
        Reset
      </Button>
    </div>
  ),
};
