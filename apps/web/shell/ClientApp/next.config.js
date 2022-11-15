// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nrwl/next/plugins/with-nx");
const { CONTACT_URL, API_URL } = process.env;

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  basePath: "",
  distDir: "dist",
  nx: {
    svgr: true,
  },
  swcMinify: true,
  trailingSlash: true,
  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },

  async rewrites() {
    return [
      /**
       * Rewrites for Multi Zones
       */
      {
        source: "/contact",
        destination: `${CONTACT_URL}`,
      },
      {
        source: "/contact/:path*",
        destination: `${CONTACT_URL}/:path*`,
      },
      {
        source: "/api/os/:path*",
        destination: `${API_URL}/api/os/:path*`,
      },
    ];
  },
};

module.exports = withNx(nextConfig);
