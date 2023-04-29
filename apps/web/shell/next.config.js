const { withNx } = require("@nrwl/next/plugins/with-nx");
const flowRight = require("lodash/flowRight");
const withI18n = require("./config/withI18n");
const withEnv = require("./config/withEnv");
const withSentry = require("./config/withSentry");
const { CONTACT_URL, REACTION_API_HOST } = process.env;

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = withNx({
  basePath: "",
  nx: {
    svgr: true,
  },

  swcMinify: true,
  reactStrictMode: true,

  compiler: {
    relay: {
      src: "./",
      language: "typescript",
      artifactDirectory: "libs/data-catalog/graphql/src/__generated__",
    },
  },

  experimental: {
    appDir: true,
  },

  transpilePackages: [
    "react-redux",
    "framer-motion",
    "@open-system/core-typescript-utilities",
    "@open-system/design-system-components",
    "@open-system/shared-ui-components",
    "@open-system/shared-ui-data-access",
    "@open-system/shared-ui-feature-form",
    "@open-system/contact-ui-data-access",
    "@open-system/reaction-ui-data-access",
    "@open-system/portfolio-ui-feature-resume",
  ],

  // Disable linting during build => the linter may have optional dev dependencies
  // (eslint-plugin-cypress) that wont exist during prod build
  // You should lint manually only
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  env: {
    NEXT_PUBLIC_IS_USING_LOCAL_DATABASE: !!(process.env.MONGO_URI || "").match(
      /localhost/
    ),
  },

  webpack: defaultConfig => {
    defaultConfig.module.rules.push({
      test: /\.ya?ml$/,
      use: "js-yaml-loader",
    });

    defaultConfig.experiments.topLevelAwait = true;
    return defaultConfig;
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
});

module.exports = flowRight([withEnv, withI18n, withSentry])(nextConfig);
