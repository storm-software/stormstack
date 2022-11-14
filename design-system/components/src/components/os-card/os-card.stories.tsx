import { h } from "@stencil/core";
import { OsCard } from "./os-card";

export default {
  title: "Card",
  component: OsCard,
};

const Template = args => <os-card {...args}></os-card>;

export const Primary = Template.bind({});
Primary.args = {
  header: "Header Text",
  summary: "Sub-title Text",
  imageSrc:
    "https://lumiere-a.akamaihd.net/v1/images/sa_pixar_virtualbg_coco_16x9_9ccd7110.jpeg?region=0,0,1920,1080&width=960",
  class: "h-10 w-20",
  style: {
    height: "200px",
    width: "400px",
  },
};
