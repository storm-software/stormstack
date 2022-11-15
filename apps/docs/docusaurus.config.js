// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

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
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/sullivanpj/open-system",
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
            spec: "libs/static/message/common/message.api-spec.json",
            route: "/apis/message/",
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
            to: "docs/apis/introduction",
            activeBasePath: "docs/apis",
            label: "OpenAPI Specs",
            position: "left",
            items: [
              {
                to: "/apis/message",
                label: "Message-APIs",
              },
            ],
          },
          {
            type: "doc",
            docId: "getting-started/installation",
            to: "docs/getting-started/installation",
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
                to: "docs/apis/introduction",
              },
              {
                label: "Design System",
                to: "design-system",
              },
              {
                label: "Docs Style Guide",
                to: "docs/doc-creation/docs-style-guide",
              },
            ],
          },
          {
            title: "Training",
            items: [
              {
                label: "Getting Started",
                to: "docs/getting-started/introduction",
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
                to: "/blog",
              },
              {
                label: "Changelog",
                to: "/blog",
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
