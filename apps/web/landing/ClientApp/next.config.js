// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nrwl/next/plugins/with-nx");
const { API_URL } = process.env;

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  basePath: "/home",
  distDir: "../../../../dist/apps/web/landing/ClientApp",
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
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = withNx(nextConfig);
