const { withNx } = require("@nrwl/next/plugins/with-nx");
const flowRight = require("lodash/flowRight");
// const withI18n = require("./config/withI18n");
// const withEnv = require("./config/withEnv");
const withSentry = require("./config/withSentry");
const { CONTACT_URL, REACTION_API_HOST } = process.env;

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  basePath: "",
  nx: {
    svgr: false,
  },

  swcMinify: true,
  reactStrictMode: true,

  experimental: {
    serverActions: true,

    serverComponentsExternalPackages: ["redis"],
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

  webpack(config) {
    config.experiments.topLevelAwait = true;

    return {
      ...config,
      module: {
        ...config?.module,
        rules: [
          ...(config?.module?.rules ?? []),
          {
            loader: "@svgr/webpack",
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: { removeViewBox: false },
                    },
                  },
                ],
              },
              titleProp: true,
            },
            test: /\.svg$/,
          },
          {
            test: /\.(eot|ttf|woff|woff2)$/,
            use: {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                publicPath: "fonts",
                outputPath: "fonts",
              },
            },
          },
        ],
      },
    };
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
};

module.exports = flowRight([withNx])(nextConfig);
