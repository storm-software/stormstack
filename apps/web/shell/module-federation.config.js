// @ts-check

const sharedLibraries = new Set([
  "react",
  "react-dom",
  "react-router",
  "react-router-dom",
]);

/**
 * @type {import('@nrwl/react/module-federation').ModuleFederationConfig}
 **/
const moduleFederationConfig = {
  name: 'web-shell',
  remotes: ['web-landing'],
  shared: (libraryName, defaultConfig) => {
    if (sharedLibraries.has(libraryName)) {
      return defaultConfig;
    }
    // Returning false means the library is not shared.
    return false;
  },
};

module.exports = moduleFederationConfig;
