//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nrwl/next/plugins/with-nx");
const withNextIntl = require("next-intl/withNextIntl");
const { CONTACT_URL, API_URL } = process.env;

const nextConfig = {
  basePath: "",
  nx: {
    svgr: false,
  },

  swcMinify: true,
  reactStrictMode: true,

  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },

  transpilePackages: [
    "react-redux",
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
      /*{
        source: "/contact",
        destination: `${CONTACT_URL}`,
      },
      {
        source: "/contact/:path*",
        destination: `${CONTACT_URL}/:path*`,
      },*/
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },

  /**
   * @param {{ module: { rules: { loader?: string; options?: { prettier: boolean; svgo: boolean; svgoConfig: { plugins: { name: string; params: { overrides: { removeViewBox: boolean; }; }; }[]; }; titleProp: boolean; }; test: RegExp; use?: { loader: string; options: { name: string; publicPath: string; outputPath: string; }; }; }[]; }; }} config
   */
  webpack(config) {
    config.module.rules.push({
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
    });

    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          publicPath: "fonts",
          outputPath: "fonts",
        },
      },
    });
    return config;
  },
};

module.exports = withNextIntl({
  ...withNx(nextConfig),
  i18nConfig: "./i18n.config.ts",
});
