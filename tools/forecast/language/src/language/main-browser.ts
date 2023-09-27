import { EmptyFileSystem, startLanguageServer } from "langium";
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection
} from "vscode-languageserver/browser";
import { createForecastServices } from "./forecast-module";

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection: any = createConnection(messageReader, messageWriter);

const { shared } = createForecastServices({ connection, ...EmptyFileSystem });

startLanguageServer(shared);
