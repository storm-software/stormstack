module.exports = {
  title: "Open System - Event Catalog",
  tagline: "Discover, Explore and Document your Event Driven Architectures",
  organizationName: "Open System",
  projectName: "Event Catalog",
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
    // found in the public dir
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
        "https://pbs.twimg.com/profile_images/1262283153563140096/DYRDqKg6_400x400.png",
      role: "Developer",
    },
    {
      id: "mSmith",
      name: "Matthew Smith",
      avatarUrl: "https://randomuser.me/api/portraits/lego/3.jpg",
      role: "Developer",
    },
  ],
  generators: [
    [
      "@eventcatalog/plugin-doc-generator-asyncapi",
      {
        pathToSpec: ["asyncapi.yml"],
        versionEvents: true,
      },
    ],
  ],
};
