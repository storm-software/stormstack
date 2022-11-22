import { OsCard } from "@open-system/design-system-components/os-card";
import { h } from "@stencil/core";

export default {
  title: "Containers/Card",
  component: OsCard,
};

const Template = args => (
  <os-card {...args}>
    <h2 slot="header">Header Text</h2>
    <label slot="summary">Sub-title Text </label>
  </os-card>
);

export const Primary = Template.bind({});
Primary.args = {
  imageSrc:
    "https://lumiere-a.akamaihd.net/v1/images/sa_pixar_virtualbg_coco_16x9_9ccd7110.jpeg?region=0,0,1920,1080&width=960",
  class: "h-10 w-20",
  style: {
    height: "200px",
    width: "400px",
  },
};
