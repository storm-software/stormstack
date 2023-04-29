const packageJSON = require("../../package.json");

// fooBar => FOO_BAR
const camelToTitle = (camelStr = "") => {
  return camelStr
    .replace(/[A-Z]/g, " $1") // fooBar => foo Bar
    .split(" ")
    .map(t => t.toUpperCase())
    .join("_");
};

const withPkgInfo = nextConfig => {
  // Public
  // It's still unclear where such config should go
  // @see https://github.com/vercel/next.js/discussions/14308
  const publicPkgInfo = {
    version: packageJSON.version,
  };
  if (!nextConfig.publicRuntimeConfig) nextConfig.publicRuntimeConfig = {};
  nextConfig.publicRuntimeConfig.pkgInfo = publicPkgInfo;
  // Also enhance environment with the same infos
  Object.entries(publicPkgInfo).map(([key, value]) => {
    const envKey = `NEXT_PUBLIC_PKGINFO_${camelToTitle(key)}`;
    nextConfig.env[envKey] = `${value}`; // we convert to string
  });

  return nextConfig;
};

// @see https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
const withEnv = (nextConfig = {}) => {
  nextConfig.env = {
    NEXT_PUBLIC_IS_USING_PROD_DATABASE: !!(process.env.MONGO_URI || "").match(
      /prod/
    ),
    NEXT_PUBLIC_IS_USING_STAGING_DATABASE: !!(process.env.MONGO_URI || "").match(
      /staging/
    ),
    NEXT_PUBLIC_IS_USING_LOCAL_DATABASE: !!(process.env.MONGO_URI || "").match(
      /localhost/
    ),
  };

  // Enable Webpack analyzer
  if (process.env.ANALYZE) {
    const debug = require("debug")("webpack");
    debug("Enabling Webpack bundle analyzer");

    const withBundleAnalyzer = require("@next/bundle-analyzer")({
      enabled: !!process.env.ANALYZE,
    });
    nextConfig = withBundleAnalyzer(nextConfig);
  }

  // To support markdown import
  nextConfig.pageExtensions = ["js", "jsx", "md", "mdx", "ts", "tsx"];

  if (process.env.MAINTENANCE_MODE) {
    nextConfig.redirects = async () => {
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
      ];
    };
  }

  return withPkgInfo(nextConfig);
};

module.exports = withEnv;
