const { withNx } = require("@nrwl/next/plugins/with-nx");
const { CONTACT_URL, REACTION_API_HOST } = process.env;

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
module.exports = withNx({
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
    "@open-system/portfolio-ui-feature-resume",
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

  /*async rewrites() {
    return [
      {
        source: "/api/reaction/:path*",
        destination: `${REACTION_API_HOST}/api/:path*`,
      },
    ];
  },*/

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
});
