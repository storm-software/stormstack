module.exports = {
  title: "Open System - Event Catalog",
  tagline: "Discover, Explore, and Document your Event-Driven Architectures",
  organizationName: "stormstack",
  projectName: "stormstack",
  basePath: "/event-catalog",
  output: "export",
  editUrl:
    "https://github.com/storm-software/stormstack/docs/event-catalog/edit/master",
  homepageLink: "https://stormcloud.dev",
  primaryCTA: {
    label: "Explore Events",
    href: "/events"
  },
  secondaryCTA: {
    label: "Getting Started",
    href: "https://stormcloud.dev"
  },
  logo: {
    alt: "Open System Logo",
    src: "logo.svg"
  },
  footerLinks: [
    { label: "Events", href: "/events" },
    { label: "Services", href: "/services" },
    { label: "Visualiser", href: "/visualiser" },
    { label: "3D Node Graph", href: "/overview" },
    {
      label: "GitHub",
      href: "https://github.com/storm-software/stormstack/docs/event-catalog/edit/master"
    }
  ],
  users: [
    {
      id: "sullivanpj",
      name: "Pat Sullivan",
      avatarUrl:
        "https://pub-e71cff0f90204755bc910518d63cacf8.r2.dev/circle-logo.png",
      role: "Developer"
    }
  ],
  generators: [
    [
      "@eventcatalog/plugin-doc-generator-asyncapi",
      {
        pathToSpec: [
          "libs/user-management/config/src/async-api/user-management-api.async-api.json"
        ],
        versionEvents: true,
        domainName: "User Management",
        domainSummary:
          "Business logic around user management and authentication processes"
      }
    ]
  ]
};
