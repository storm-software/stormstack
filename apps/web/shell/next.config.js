const { composePlugins, withNx } = require("@nx/next");
const { get } = require("@vercel/edge-config");

// const flowRight = require("lodash/flowRight");
// const withI18n = require("./config/withI18n");
//const withSentry = require("./config/withSentry");
// const { withSentryConfig } = require("@sentry/nextjs");
// const { CONTACT_URL, ABLY_API_KEY } = process.env;

// https://nextjs.org/docs/advanced-features/security-headers
const CONTENT_SECURITY_POLICY = `
      default-src 'self' vercel.live;
      script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live;
      style-src 'self' 'unsafe-inline';
      img-src * blob: data:;
      media-src 'none';
      connect-src *;
      font-src 'self';
  `;

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

  swcMinify: false,
  reactStrictMode: false,

  /*pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],*/

  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["redis", "redis-om"],
    instrumentationHook: true,

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

  devIndicators: {
    buildActivityPosition: "bottom-right",
  },

  transpilePackages: [
    "jotai",
    "framer-motion",
    "lottie-web",
    "react-hook-form",
    "@open-system/design-system-components",
    "@open-system/core-components",
    "@open-system/core-data-access",
    "@open-system/core-feature-form",
    "@open-system/core-feature-notifications",
    "@open-system/shared-components",
    "@open-system/shared-data-access",
    "@open-system/shared-feature-address",
    "@open-system/user-management-components",
    "@open-system/user-management-data-access",
    "@open-system/contact-feature-form",
    "@open-system/contact-data-access",
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

  images: {
    disableStaticImages: true,
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

  rewrites() {
    return [
      { source: "/healthz", destination: "/api/health" },
      { source: "/api/healthz", destination: "/api/health" },
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" },
    ];
  },

  redirects() {
    try {
      return get("redirects");
    } catch {
      return [];
    }
  },

  headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
          {
            key: "Content-Security-Policy",
            value: CONTENT_SECURITY_POLICY.replace(/\n/g, ""),
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
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

  config => {
    // Enable Webpack analyzer
    if (process.env.ANALYZE) {
      const withBundleAnalyzer = require("@next/bundle-analyzer")({
        enabled: !!process.env.ANALYZE,
      });
      return withBundleAnalyzer(config);
    }

    return config;
  },

  config => {
    if (process.env.MAINTENANCE_MODE) {
      config.redirects = async () => {
        return [
          {
            source: "/",
            destination: "/maintenance",
            permanent: false,
          },
          {
            source: "/((?!maintenance|_next|api).*)",
            destination: "/maintenance",
            permanent: false,
          },
          ...config.redirects,
        ];
      };
    }

    return config;
  },

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
