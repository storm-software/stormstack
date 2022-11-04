const path = require('path');

const publicPath = './output';
const fontFormats = ['woff', 'woff2'];
const assetsFolderPath = 'assets';
const fontsFolderPath = `${publicPath}/${assetsFolderPath}/fonts`;
const vectorsFolderPath = `${publicPath}/${assetsFolderPath}/vectors`;
const designTokensFolderPath = `${publicPath}/styles`;

const designTokensRules = [
  {
    name: 'Design Tokens / Theme',
    path: `${publicPath}/theme.js`,
    filter: {
      types: ['color', 'textStyle', 'font'],
    },
    parsers: [
      {
        name: 'to-tailwind',
        options: {
          formatName: 'camelCase',
          formatConfig: {
            objectName: 'extend',
            module: 'commonjs',
          },
        },
      },
    ],
  },
];

const fontRules = [
  {
    name: 'Design Tokens / CSS font imports',
    path: `${designTokensFolderPath}/fonts.css`,
    filter: {
      types: ['font'],
    },
    parsers: [
      {
        name: 'to-css-font-import',
        options: {
          formats: fontFormats,
          fontsPath: path.relative(designTokensFolderPath, fontsFolderPath),
        },
      },
    ],
  },
  {
    name: 'Design Tokens / Export fonts',
    path: fontsFolderPath,
    filter: {
      types: ['font'],
    },
    parsers: [
      {
        name: 'convert-font',
        options: {
          formats: fontFormats,
        },
      },
    ],
  },
];

const vectorRules = [
  {
    name: 'Design Tokens / Vector',
    path: `${vectorsFolderPath}`,
    filter: {
      types: ['vector'],
    },
    parsers: [
      {
        'name': 'kebabcasify',
      },
      {
        name: 'svgo',
        options: {
          svgo: {
            js2svg: {
              pretty: true,
            },
            plugins: [
              {
                removeDimensions: true,
              },
              {
                removeAttrs: {
                  attrs: '*:(fill|stroke)',
                },
              },
              {
                addAttributesToSVGElement: {
                  // The svg also has a focusable attribute set
                  // to false which prevents the icon itself
                  // from receiving focus in IE, because otherwise
                  // the button will have two Tab stops, which is
                  // not the expected or desired behavior.
                  attributes: ['width="1em"', 'height="1em"', 'focusable="false"'],
                },
              },
            ],
          },
        },
      },
    ],
  },
];

/*
 * Finally exports the configuration
 */
module.exports = {
  // Find more about how to target a Specify repository at: https://specifyapp.com/developers/api#heading-parameters
  repository: '@owner/name',
  personalAccessToken: '<your-personal-access-token>',
  rules: [...designTokensRules, ...fontRules, ...vectorRules],
};
