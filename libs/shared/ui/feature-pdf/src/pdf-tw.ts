/* eslint-disable @typescript-eslint/no-var-requires */
import { Font } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const extend: any = require("../../../../../dist/design-system/tokens/js/theme");
const AnybodyBold: any = require("../../../../../assets/fonts/Anybody-Black.ttf");
const AnybodyLight: any = require("../../../../../assets/fonts/Anybody-Light.ttf");
const Anybody: any = require("../../../../../assets/fonts/Anybody-Regular.ttf");
const InterBold: any = require("../../../../../assets/fonts/Inter-Bold.ttf");
const Inter: any = require("../../../../../assets/fonts/Inter-Regular.ttf");

Font.register({
  family: "Anybody",
  src: Anybody,
});

Font.register({
  family: "Anybody-Bold",
  src: AnybodyBold,
});

Font.register({
  family: "Anybody-Light",
  src: AnybodyLight,
});

Font.register({
  family: "Inter",
  src: Inter,
});

Font.register({
  family: "Inter-Bold",
  src: InterBold,
});

export const pdfTw = createTw({
  "theme": {
    "extend": {
      ...extend,
      "fontFamily": {
        "anybody": ["Anybody"],
        "anybody-bold": ["Anybody-Bold"],
        "anybody-light": ["Anybody-Light"],
        "melody": ["Melody"],
        "inter": ["Inter"],
        "inter-bold": ["Inter-Bold"],
      },
    },
  },
});
