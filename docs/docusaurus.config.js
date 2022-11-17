// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const path = require("path");
require("dotenv").config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Open System",
  tagline: "Application Documentation and Developer Guide",
  url: "https://sullivanpj.github.io",
  baseUrl: "/open-system/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "sullivanpj",
  projectName: "open-system",
  trailingSlash: false,
  titleDelimiter: "🧪",
  plugins: [
    [
      "docusaurus-plugin-typedoc-api",
      {
        projectRoot: path.join(__dirname, ".."),
        changelogName: "CHANGELOG.md",
        changelogs: true,
        readmeName: "README.md",
        readmes: true,
        tsconfigName: "tsconfig.base.json",
        packages: [
          {
            path: "libs/core/typescript/utilities",
            entry: {
              file: "src/index.ts",
              label: "Core TypeScript Utilities",
            },
          },
          {
            path: "design-system/components",
            entry: {
              file: "src/index.ts",
              label: "Design-System Components",
            },
          },
          {
            path: "libs/shared/ui/components",
            entry: {
              file: "src/index.ts",
              label: "Shared UI-Components",
            },
          },
        ],
      },
    ],
    [
      "docusaurus2-dotenv",
      {
        path: "docs/.env", // The path to your environment variables.
        safe: false, // If false ignore safe-mode, if true load './.env.example', if a string load that file as the sample
        systemvars: false, // Set to true if you would rather load all system variables as well (useful for CI purposes)
        silent: true, //  If true, all warnings will be suppressed
        expand: false, // Allows your variables to be "expanded" for reusability within your .env file
        defaults: false, //  Adds support for dotenv-defaults. If set to true, uses ./.env.defaults
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/sullivanpj/open-system",
          exclude: ["**/decisions/**"],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
    [
      "redocusaurus",
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            id: "Message-APIs",
            spec: "libs/static/message/common/src/message.api-spec.json",
            route: "/end-points/message/",
          },
        ],
        theme: {},

        /**
         * Options to pass to Redoc
         *
         * @see https://github.com/redocly/redoc#redoc-options-object
         */
        options: { expandResponses: "200" },
      },
    ],
  ],

  themes: ["docusaurus-theme-redoc", "docusaurus-theme-search-typesense"],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      announcementBar: {
        id: "alert",
        content:
          '<b> The developer of this repository is looking for work! If interested, please reach out to <a target="_blank" rel="noopener noreferrer" href="mailto:Patrick.Joseph.Sullivan@ProtonMail.com">Patrick.Joseph.Sullivan@ProtonMail.com</a>.</b>',
        backgroundColor: "#371864",
        textColor: "#fff",
        isCloseable: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
      typesense: {
        typesenseCollectionName: "docusaurus-2", // Replace with your own doc site's name. Should match the collection name in the scraper settings.

        typesenseServerConfig: {
          nodes: [
            {
              host: "host.docker.internal",
              port: 443,
              protocol: "https",
            },
          ],
          apiKey: "xyz",
        },

        // Optional: Typesense search parameters: https://typesense.org/docs/0.21.0/api/search.md#search-parameters
        typesenseSearchParameters: {},

        // Optional
        contextualSearch: true,
      },
      navbar: {
        title: "Open System",
        items: [
          {
            to: "design-system",
            position: "left",
            label: "Design System",
          },
          {
            to: "end-points/introduction",
            activeBasePath: "docs/end-points",
            label: "OpenAPI Specs",
            position: "left",
            items: [
              {
                to: "/end-points/message",
                label: "Message-APIs",
              },
            ],
          },
          {
            to: "api",
            label: "API",
            position: "left",
          },
          {
            type: "doc",
            docId: "getting-started/installation",
            to: "getting-started/installation",
            activeBasePath: "docs/getting-started",
            label: "Training",
            position: "left",
          },
          {
            href: "https://github.com/sullivanpj/open-system",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Documents",
            items: [
              {
                label: "OpenAPI Specs",
                to: "end-points/introduction",
              },
              {
                label: "Design System",
                to: "design-system",
              },
              {
                label: "Docs Style Guide",
                to: "doc-creation/docs-style-guide",
              },
            ],
          },
          {
            title: "Training",
            items: [
              {
                label: "Getting Started",
                to: "getting-started/introduction",
              },
            ],
          },
          {
            title: "Developer",
            items: [
              {
                href: "https://wwww.linkedin.com/in/patrick-sullivan-dev",
                label: "LinkedIn",
                position: "right",
              },
              {
                label: "GitHub",
                href: "https://github.com/sullivanpj",
              },
            ],
          },
          {
            title: "Repository",
            items: [
              {
                label: "Links",
                to: "docs/changelog",
              },
              {
                label: "Changelog",
                to: "docs/changelog",
              },
              {
                label: "GitHub",
                href: "https://github.com/sullivanpj/open-system",
              },
            ],
          },
        ],
        logo: {
          alt: "Open System Solutions",
          src: "img/open-system-logo.gif",
          href: "https://github.com/sullivanpj/open-system",
          width: 105,
          height: 150,
        },
        copyright: `Copyright © ${new Date().getFullYear()} Open System Solutions, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
