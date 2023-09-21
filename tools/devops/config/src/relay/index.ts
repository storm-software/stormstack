const config = {
  src: "./",
  artifactDirectory: "./libs/common/client/data-access/__generated__/relay",
  language: "typescript",
  schema: "./.wundergraph/generated/wundergraph.schema.graphql",
  exclude: [
    "**/node_modules/**",
    "**/__mocks__/**",
    "**/__generated__/**",
    "**/.wundergraph/generated/**",
  ],
  persistConfig: {
    file: "./.wundergraph/operations/relay/persisted.json",
  },
  eagerEsModules: true,
};

export default config;
