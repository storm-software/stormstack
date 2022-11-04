import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: '#6728c3',
  colorSecondary: '#595959',

  // UI
  appBg: '#e6e6e6',
  appContentBg: '#e6e6e6',
  appBorderColor: '#e6e6e6',
  appBorderRadius: 2,

  // Text colors
  textColor: '#004d7e',
  textInverseColor: '#e6e6e6',

  // Toolbar default and active colors
  barTextColor: '#595959',
  barSelectedColor: '#e6e6e6',
  barBg: '#004d7e',

  // Form colors
  inputBg: '#e6e6e6',
  inputBorder: '#004d7e',
  inputTextColor: '#595959',
  inputBorderRadius: 2,

  brandTitle: 'Open System',
  brandUrl: 'https://github.com/sullivanpj/open-system',
  // brandImage: require("../../assets/open-system.png"),
});
