// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nrwl/next/plugins/with-nx");
const { DOCS_URL, API_URL } = process.env;

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  basePath: "",
  distDir: "../../../../dist/apps/web/shell/ClientApp",
  nx: {
    svgr: true,
  },
  swcMinify: true,
  experimental: {
    // Required:
    appDir: true,
  },

  async rewrites() {
    return [
      /**
       * Rewrites for Multi Zones
       */
      {
        source: "/home",
        destination: `${DOCS_URL}`,
      },
      {
        source: "/home/:path*",
        destination: `${DOCS_URL}/:path*`,
      },
      {
        source: "/api/os/:path*",
        destination: `${API_URL}/api/os/:path*`,
      },
    ];
  },
};

module.exports = withNx(nextConfig);
