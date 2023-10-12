import relayConfigJson from "../../relay.config.json";

export interface NextJsRelayCompilerConfig {
  src: string;
  artifactDirectory?: string;
  language?: "typescript" | "javascript" | "flow";
  eagerEsModules?: boolean;
}

export type NextJsConfig = Record<string, any> & {
  compiler?: {
    relay?: NextJsRelayCompilerConfig;
  };
};

export const withRelayConfig =
  (relayConfig: Partial<NextJsRelayCompilerConfig> = {}): NextJsConfig =>
  (nextConfig: Partial<NextJsConfig> = {}) => {
    return {
      ...nextConfig,
      compiler: {
        ...nextConfig?.compiler,
        relay: {
          ...relayConfigJson,
          ...nextConfig?.compiler?.relay,
          ...relayConfig
        }
      }
    };
  };
