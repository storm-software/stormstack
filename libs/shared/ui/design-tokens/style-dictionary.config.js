const StyleDictionary = require("style-dictionary");
const version = require("./package.json").version;

StyleDictionary.registerFileHeader({
  name: "openSystemHeader",
  fileHeader: _ => {
    const current = new Date();

    return [
      `** Do NOT edit this file directly **`,
      `Code generated on ${current.getDate()}/${
        current.getMonth() + 1
      }/${current.getFullYear()} @ ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()} by Open System`,
      ``,
      `Open System - Design Tokens v${version ?? "1.0"}`,
      `Documentation: https://sullivanpj.github.io/open-system/design-system`,
    ];
  },
});

module.exports = {
  "source": ["libs/shared/ui/design-tokens/src/**/*.json"],
  "platforms": {
    "js": {
      "transformGroup": "js",
      "prefix": "os-",
      "buildPath": "dist/libs/shared/ui/design-tokens/js/",
      "files": [
        {
          "destination": "variables.js",
          "format": "javascript/module",
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
      ],
    },
    "css": {
      "transformGroup": "css",
      "prefix": "open-sys",
      "buildPath": "dist/libs/shared/ui/design-tokens/css/",
      "files": [
        {
          "destination": "variables.css",
          "format": "css/variables",
          "options": {
            "outputReferences": true,
            "fileHeader": "openSystemHeader",
          },
        },
      ],
      "actions": ["copy_assets"],
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "dist/libs/shared/ui/design-tokens/scss/",
      "files": [
        {
          "destination": "_variables.scss",
          "format": "scss/variables",
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
      ],
    },
    "android": {
      "transformGroup": "android",
      "buildPath": "dist/libs/shared/ui/design-tokens/android/",
      "files": [
        {
          "destination": "font_dimens.xml",
          "format": "android/fontDimens",
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
        {
          "destination": "colors.xml",
          "format": "android/colors",
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
      ],
    },
    "compose": {
      "transformGroup": "compose",
      "buildPath": "dist/libs/shared/ui/design-tokens/compose/",
      "files": [
        {
          "destination": "StyleDictionaryColor.kt",
          "format": "compose/object",
          "className": "StyleDictionaryColor",
          "packageName": "StyleDictionaryColor",
          "filter": {
            "attributes": {
              "category": "color",
            },
          },
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
        {
          "destination": "StyleDictionarySize.kt",
          "format": "compose/object",
          "className": "StyleDictionarySize",
          "packageName": "StyleDictionarySize",
          "type": "float",
          "filter": {
            "attributes": {
              "category": "size",
            },
          },
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
      ],
    },
    "ios": {
      "transformGroup": "ios",
      "buildPath": "dist/libs/shared/ui/design-tokens/ios/",
      "files": [
        {
          "destination": "StyleDictionaryColor.h",
          "format": "ios/colors.h",
          "className": "StyleDictionaryColor",
          "type": "StyleDictionaryColorName",
          "filter": {
            "attributes": {
              "category": "color",
            },
          },
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
        {
          "destination": "StyleDictionaryColor.m",
          "format": "ios/colors.m",
          "className": "StyleDictionaryColor",
          "type": "StyleDictionaryColorName",
          "filter": {
            "attributes": {
              "category": "color",
            },
          },
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
        {
          "destination": "StyleDictionarySize.h",
          "format": "ios/static.h",
          "className": "StyleDictionarySize",
          "type": "float",
          "filter": {
            "attributes": {
              "category": "size",
            },
          },
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
        {
          "destination": "StyleDictionarySize.m",
          "format": "ios/static.m",
          "className": "StyleDictionarySize",
          "type": "float",
          "filter": {
            "attributes": {
              "category": "size",
            },
          },
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
      ],
    },
    "ios-swift": {
      "transformGroup": "ios-swift",
      "buildPath": "dist/libs/shared/ui/design-tokens/ios-swift/",
      "files": [
        {
          "destination": "StyleDictionary+Class.swift",
          "format": "ios-swift/class.swift",
          "className": "StyleDictionaryClass",
          "filter": {},
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
        {
          "destination": "StyleDictionary+Enum.swift",
          "format": "ios-swift/enum.swift",
          "className": "StyleDictionaryEnum",
          "filter": {},
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
        {
          "destination": "StyleDictionary+Struct.swift",
          "format": "ios-swift/any.swift",
          "className": "StyleDictionaryStruct",
          "filter": {},
          "options": {
            "imports": "SwiftUI",
            "objectType": "struct",
            "accessControl": "internal",
            "fileHeader": "openSystemHeader",
          },
        },
      ],
    },
    "ios-swift-separate-enums": {
      "transformGroup": "ios-swift-separate",
      "buildPath": "dist/libs/shared/ui/design-tokens/ios-swift/",
      "files": [
        {
          "destination": "StyleDictionaryColor.swift",
          "format": "ios-swift/enum.swift",
          "className": "StyleDictionaryColor",
          "filter": {
            "attributes": {
              "category": "color",
            },
          },
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
        {
          "destination": "StyleDictionarySize.swift",
          "format": "ios-swift/enum.swift",
          "className": "StyleDictionarySize",
          "filter": {
            "attributes": {
              "category": "size",
            },
          },
          "options": {
            "fileHeader": "openSystemHeader",
          },
        },
      ],
    },
  },
};
