const { withSentryConfig } = require("@sentry/nextjs");

const withSentry = (nextConfig = {}) => {
  /**
   * Disable source map upload
   */
  let shouldDisableSentry = undefined;
  if (
    process.env.NODE_ENV === "development" ||
    !!process.env.SKIP_SENTRY_SOURCEMAP_UPLOAD
  ) {
    shouldDisableSentry = true;
  }

  if (process.env.NODE_ENV === "production") {
    if (!process.env.SENTRY_AUTH_TOKEN) {
      console.warn(
        "SENTRY_AUTH_TOKEN not provided while building for production.\
       Ignore this warning if you are building locally."
      );
      shouldDisableSentry = true;
    }

    if (!process.env.SENTRY_PROJECT || !process.env.SENTRY_ORGANIZATION) {
      console.warn(
        "No Sentry project set. This is expected for Vercel preview deployments, but shouldn't happen with the main branch."
      );
      shouldDisableSentry = true;
    }
  }

  if (process.env.SKIP_SENTRY_SOURCEMAP_UPLOAD) {
    console.info(
      "Source map upload disabled for Sentry via SKIP_SENTRY_SOURCEMAP_UPLOAD"
    );
  }

  if (!shouldDisableSentry) {
    console.info(
      "Will upload sourcemaps to Sentry. Set SKIP_SENTRY_SOURCEMAP_UPLOAD=1 to skip."
    );
  }

  nextConfig = {
    ...nextConfig,
    sentry: {
      ...nextConfig.sentry,

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
    },
  };

  return withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    org: process.env.SENTRY_ORGANIZATION,
    project: process.env.SENTRY_PROJECT,

    silent: true, // Suppresses all logs

    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
    // Will disable release creation and source map upload during local dev
    dryRun: shouldDisableSentry,
    disableServerWebpackPlugin: shouldDisableSentry,
    disableClientWebpackPlugin: shouldDisableSentry,
  });
};

module.exports = withSentry;
