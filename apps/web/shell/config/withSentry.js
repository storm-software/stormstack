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

    if (!process.env.SENTRY_PROJECT) {
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

  return {
    ...withSentryConfig(nextConfig, {
      // Additional config options for the Sentry Webpack plugin. Keep in mind that
      // the following options are set automatically, and overriding them is not
      // recommended:
      //   release, url, org, project, authToken, configFile, stripPrefix,
      //   urlPrefix, include, ignore

      silent: true, // Suppresses all logs
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options.
      // Will disable release creation and source map upload during local dev
      dryRun: shouldDisableSentry,
      disableServerWebpackPlugin: shouldDisableSentry,
      disableClientWebpackPlugin: shouldDisableSentry,
    }),
    disableServerWebpackPlugin: shouldDisableSentry,
    disableClientWebpackPlugin: shouldDisableSentry,
  };
};

module.exports = withSentry;
