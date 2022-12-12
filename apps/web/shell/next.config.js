//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nrwl/next/plugins/with-nx");
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
    transpilePackages: ["@open-system/design-system-components"],
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

  async rewrites() {
    return [
      {
        source: "/contact",
        destination: `${CONTACT_URL}`,
      },
      {
        source: "/contact/:path*",
        destination: `${CONTACT_URL}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },

  /**
   * @param {{ module: { rules: { loader: string; options: { prettier: boolean; svgo: boolean; svgoConfig: { plugins: { name: string; params: { overrides: { removeViewBox: boolean; }; }; }[]; }; titleProp: boolean; }; test: RegExp; }[]; }; }} config
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
    return config;
  },
};

module.exports = withNx(nextConfig);
