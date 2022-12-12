// Note: If you use library-specific PostCSS/Tailwind configuration then you should remove the `postcssConfig` build
// option from your application's configuration (i.e. project.json).
//
// See: https://nx.dev/guides/using-tailwind-css-in-react#step-4:-applying-configuration-to-libraries

// const { join } = require("path");

module.exports = {
  plugins: {
    tailwindcss: {
      config: "tailwind.config.js",
    },
    autoprefixer: {},
  },
};
