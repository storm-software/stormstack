const { withNx } = require("@nrwl/next/plugins/with-nx");
const withNextIntl = require("next-intl/withNextIntl");
const { CONTACT_URL, API_URL } = process.env;

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

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },

  transpilePackages: [
    "react-redux",
    "framer-motion",
    "@open-system/core-typescript-utilities",
    "@open-system/design-system-components",
    "@open-system/shared-ui-data-access",
    "@open-system/shared-ui-feature-form",
    "@open-system/contact-ui-data-access",
    "@open-system/reaction-ui-data-access",
  ],

  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },

  webpack(config) {
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
};

module.exports = withNextIntl({
  ...withNx(nextConfig),
  i18nConfig: "./i18n.config.ts",
});
