module.exports = {
  title: "Open System - Event Catalog",
  tagline: "Discover, Document, and Explore your Event Driven Architectures",
  organizationName: "sullivanpj",
  projectName: "open-system",
  basePath: "/event-catalog",
  output: "export",
  editUrl:
    "https://github.com/sullivanpj/open-system/docs/event-catalog/edit/master",
  homepageLink: "https://patsullivan.org",
  primaryCTA: {
    label: "Explore Events",
    href: "/events",
  },
  secondaryCTA: {
    label: "Getting Started",
    href: "https://patsullivan.org",
  },
  logo: {
    alt: "Open System Logo",
    src: "logo.svg",
  },
  footerLinks: [
    { label: "Events", href: "/events" },
    { label: "Services", href: "/services" },
    { label: "Visualiser", href: "/visualiser" },
    { label: "3D Node Graph", href: "/overview" },
    {
      label: "GitHub",
      href: "https://github.com/sullivanpj/open-system/docs/event-catalog/edit/master",
    },
  ],
  users: [
    {
      id: "sullivanpj",
      name: "Pat Sullivan",
      avatarUrl:
        "https://pub-e71cff0f90204755bc910518d63cacf8.r2.dev/circle-logo.png",
      role: "Developer",
    },
  ],
  generators: [
    [
      "@eventcatalog/plugin-doc-generator-asyncapi",
      {
        pathToSpec: [
          "libs/user-management/config/src/async-api/user-management-api.async-api.json",
        ],
        versionEvents: true,
        domainName: "User Management",
        domainSummary:
          "Business logic around user management and authentication processes",
      },
    ],
  ],
};
