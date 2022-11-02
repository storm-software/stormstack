/*const fs = require("fs");

let tokens = [];
fs.readdirSync("./docs/design-tokens").forEach(file => {
  const contents = fs.readFileSync(`./docs/design-tokens/${file}`, "utf-8");

  if (contents) {
    tokens.push(id);
  }
});*/

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  someSidebar: {
    "Getting Started": [
      "getting-started/installation",
      "getting-started/introduction",
      "getting-started/nx-console",
    ],
    "OpenAPI Specs": ["apis/introduction"],
    "Creating Docs": ["doc-creation/docs-style-guide"],
  },
};

module.exports = sidebars;
