import { PrerenderConfig } from "@stencil/core";

export const config: PrerenderConfig = {
  hydrateOptions(url: URL) {
    return {
      prettyHtml: true,
      addModulePreloads: true,
    };
  },
};
