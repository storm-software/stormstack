import { startLanguageServer } from "langium";
import { NodeFileSystem } from "langium/node";
import { createConnection, ProposedFeatures } from "vscode-languageserver/node";
import { createStormServices } from "./storm-module";

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the shared services and language-specific services
const { shared } = createStormServices({
  connection: connection as any,
  ...NodeFileSystem,
});

// Start the language server with the shared services
startLanguageServer(shared);
