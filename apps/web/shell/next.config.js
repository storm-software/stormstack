const { composePlugins, withNx } = require("@nx/next");
const { get } = require("@vercel/edge-config");

// const flowRight = require("lodash/flowRight");
// const withI18n = require("./config/withI18n");
//const withSentry = require("./config/withSentry");
// const { withSentryConfig } = require("@sentry/nextjs");

const { NEXT_PUBLIC_CORS_URL, ANALYZE, MAINTENANCE_MODE } = process.env;

/*const baseUrl = NEXT_PUBLIC_BASE_URL
  ? `${NEXT_PUBLIC_BASE_URL}`
  : "localhost:3000";*/

// const corsUrl = NEXT_PUBLIC_CORS_URL ? `${NEXT_PUBLIC_CORS_URL}` : baseUrl;

// https://nextjs.org/docs/advanced-features/security-headers
const CONTENT_SECURITY_POLICY = `
      default-src 'self' patsullivan.org *.patsullivan.org;
      script-src 'self' patsullivan.org *.patsullivan.org 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live;
      child-src 'self' patsullivan.org *.patsullivan.org;
      style-src 'self' patsullivan.org *.patsullivan.org 'unsafe-inline';
      img-src 'self' data: https:;
      media-src 'self' patsullivan.org *.patsullivan.org;
      manifest-src 'self' patsullivan.org *.patsullivan.org;
      connect-src 'self' patsullivan.org *.patsullivan.org vitals.vercel-insights.com vercel.live;
      font-src 'self' patsullivan.org *.patsullivan.org;
      frame-ancestors 'self' patsullivan.org *.patsullivan.org;
  `;

/*
      default-src 'self' ${baseUrl};
      script-src 'self' ${baseUrl} 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live;
      child-src 'self' ${baseUrl};
      style-src 'self' ${baseUrl} 'unsafe-inline';
      img-src data: * 'self' ${baseUrl} mediastream: * 'self' ${baseUrl} blob: * 'self' ${baseUrl} filesystem: * 'self' ${baseUrl} https: * 'self' ${baseUrl};
      media-src 'self' ${baseUrl};
      manifest-src *;
      connect-src 'self' ${baseUrl} vitals.vercel-insights.com vercel.live;
      font-src 'self' ${baseUrl};


  */

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  basePath: "",

  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false
  },

  swcMinify: true,
  reactStrictMode: true,

  /*pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],*/

  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["redis", "redis-om"],
    instrumentationHook: true

    /*swcPlugins: [
      [
        "next-superjson-plugin",
        {
          excluded: [],
        },
      ],
    ],
    webpackBuildWorker: true,
    swcTraceProfiling: true,
    forceSwcTransforms: true,*/
  },

  compiler: {
    relay: {
      src: "./",
      language: "typescript",
      artifactDirectory: "./__generated__/relay"
    }
  },

  devIndicators: {
    buildActivityPosition: "bottom-right"
  },

  transpilePackages: [
    "jotai",
    "framer-motion",
    "lottie-web",
    "react-hook-form",
    "react-relay",
    "relay-runtime",
    "@stormstack/design-system-components",
    "@stormstack/core-shared-utilities",
    "@stormstack/core-shared-data-access",
    "@stormstack/core-client-components",
    "@stormstack/core-client-data-access",
    "@stormstack/core-client-form",
    "@stormstack/core-client-notifications",
    "@stormstack/core-client-pdf",
    "@stormstack/core-client-utilities",
    "@stormstack/core-server-utilities",
    "@stormstack/common-client-components",
    "@stormstack/common-client-data-access",
    "@stormstack/common-client-address",
    "@stormstack/user-management-client-components",
    "@stormstack/user-management-client-data-access",
    "@stormstack/user-management-shared-data-access",
    "@stormstack/contact-client-components",
    "@stormstack/contact-client-data-access",
    "@stormstack/engagement-client-data-access",
    "@stormstack/engagement-client-rating",
    "@stormstack/engagement-client-reaction",
    "@stormstack/engagement-server-data-access"
  ],

  // Disable linting during build => the linter may have optional dev dependencies
  // (eslint-plugin-cypress) that wont exist during prod build
  // You should lint manually only
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },

  // https://nextjs.org/docs/app/api-reference/next-config-js/typescript
  typescript: {
    ignoreBuildErrors: true
  },

  // https://nextjs.org/docs/app/api-reference/next-config-js/poweredByHeader
  poweredByHeader: false,

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
                      overrides: { removeViewBox: false }
                    }
                  }
                ]
              },
              titleProp: true
            },
            test: /\.svg$/
          },
          {
            test: /\.(eot|ttf|woff|woff2)$/,
            use: {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                publicPath: "fonts",
                outputPath: "fonts"
              }
            }
          },
          {
            test: /\.gz$/,
            enforce: "pre",
            use: "gzip-loader"
          }
        ]
      }
    };
  },

  rewrites() {
    return [
      { source: "/healthz", destination: "/api/health" },
      { source: "/api/healthz", destination: "/api/health" },
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" }
    ];
  },

  redirects() {
    try {
      return get("redirects");
    } catch {
      return [];
    }
  }

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

  config => {
    // Enable Webpack analyzer
    if (ANALYZE) {
      const withBundleAnalyzer = require("@next/bundle-analyzer")({
        enabled: !!ANALYZE
      });
      return withBundleAnalyzer(config);
    }

    return config;
  },

  config => {
    if (MAINTENANCE_MODE) {
      config.redirects = async () => {
        return [
          {
            source: "/",
            destination: "/maintenance",
            permanent: false
          },
          {
            source: "/((?!maintenance|_next|api).*)",
            destination: "/maintenance",
            permanent: false
          },
          ...config.redirects
        ];
      };
    }

    return config;
  }

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
