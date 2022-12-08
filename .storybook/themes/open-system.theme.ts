import { create } from "@storybook/theming";

export default create({
  base: "dark",

  colorPrimary: "#FFFFFF",
  colorSecondary: "#8B949E",

  // UI
  appBg: "#18181B",
  appContentBg: "#18181B",
  appBorderColor: "#FFFFFF",
  appBorderRadius: 2,

  // Text colors
  textColor: "#FFFFFF",
  textInverseColor: "#0DDACA",

  // Toolbar default and active colors
  barTextColor: "#FFFFFF",
  barSelectedColor: "#0DDACA",
  barBg: "#503083",

  // Form colors
  inputBg: "#2D3348",
  inputBorder: "#8B949E",
  inputTextColor: "#8B949E",
  inputBorderRadius: 2,

  brandTitle: "Open System",
  brandUrl: "https://github.com/sullivanpj/open-system",
  brandImage: require("../../assets/logo-inverse.svg"),
});
