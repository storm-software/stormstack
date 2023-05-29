const { composePlugins, withNx } = require("@nx/next");
// const flowRight = require("lodash/flowRight");
// const withI18n = require("./config/withI18n");
// const withEnv = require("./config/withEnv");
//const withSentry = require("./config/withSentry");
const { withSentryConfig } = require("@sentry/nextjs");
// const { CONTACT_URL, ABLY_API_KEY } = process.env;

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  basePath: "",

  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  swcMinify: true,
  reactStrictMode: true,

  experimental: {
    typedRoutes: true,
    serverActions: true,
    serverComponentsExternalPackages: ["redis", "redis-om"],
  },

  devIndicators: {
    buildActivityPosition: "bottom-right",
  },

  transpilePackages: [
    "framer-motion",
    "react-lottie",
    "@open-system/design-system-components",
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

  /*sentry: {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },*/

  /*async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },*/
};

const plugins = [
  // require("@next/mdx")(),
  withNx,
  /*config =>
    withSentryConfig(
      config,
      {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        // Suppresses source map uploading logs during build
        org: process.env.SENTRY_ORGANIZATION,
        project: process.env.SENTRY_PROJECT,

        silent: false, // Suppresses all logs

        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options.
        // Will disable release creation and source map upload during local dev
        dryRun: false,
        disableServerWebpackPlugin: false,
        disableClientWebpackPlugin: false,
      }
    ),*/
];

module.exports = composePlugins(...plugins)(nextConfig);
