import { Container } from "inversify";
import "reflect-metadata";
import {
  AbstractHttpLibrary,
  AbstractHttpMiddleware,
  AbstractHttpServerConfiguration,
  HttpServerConfiguration,
  IsomorphicFetchHttpLibrary,
  LoggingHttpMiddleware,
} from "../http-utilities";

export const INVERSION_CONTAINER = new Container({
  /* autoBindInjectable: true */ skipBaseClassChecks: true,
});

INVERSION_CONTAINER.bind<AbstractHttpLibrary>(AbstractHttpLibrary).to(
  IsomorphicFetchHttpLibrary
);
INVERSION_CONTAINER.bind<AbstractHttpMiddleware>(AbstractHttpMiddleware).to(
  LoggingHttpMiddleware
);
INVERSION_CONTAINER.bind<AbstractHttpServerConfiguration>(
  AbstractHttpServerConfiguration
).to(HttpServerConfiguration);
/*INVERSION_CONTAINER.bind<AbstractHttpConfiguration>(
  AbstractHttpConfiguration
).to(HttpConfiguration);*/
