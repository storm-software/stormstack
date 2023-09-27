import { startLanguageServer } from "langium";
import { NodeFileSystem } from "langium/node";
import { createConnection, ProposedFeatures } from "vscode-languageserver/node";
import { createForecastServices } from "./forecast-module";

// Create a connection to the client
const connection: any = createConnection(ProposedFeatures.all);

// Inject the shared services and language-specific services
const { shared } = createForecastServices({ connection, ...NodeFileSystem });

// Start the language server with the shared services
startLanguageServer(shared);
