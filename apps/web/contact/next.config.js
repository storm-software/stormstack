//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nrwl/next/plugins/with-nx");
const withNextIntl = require("next-intl/withNextIntl");
const { API_URL } = process.env;

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  basePath: "/contact",
  nx: {
    svgr: true,
  },
  swcMinify: true,
  reactStrictMode: true,

  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
    transpilePackages: [
      "reflect-metadata",
      "framer-motion",
      "@open-system/core-typescript-utilities",
      "@open-system/design-system-components",
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = withNextIntl({
  ...withNx(nextConfig),
  i18nConfig: "./i18n.config.ts",
});
