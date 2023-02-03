import { Font } from "@react-pdf/renderer";
import createTw from "react-pdf-tailwind";
import AnybodyBold from "../../../../../assets/fonts/Anybody-Black.ttf";
import AnybodyLight from "../../../../../assets/fonts/Anybody-Light.ttf";
import Anybody from "../../../../../assets/fonts/Anybody-Regular.ttf";
import InterBold from "../../../../../assets/fonts/Inter-Bold.ttf";
import Inter from "../../../../../assets/fonts/Inter-Regular.ttf";
import extend from "../../../../../dist/design-system/tokens/js/theme";

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
