/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable, multiInject, optional } from "inversify";
import { CustomUtilityClass } from "../common";
import { Tokens } from "../types";
import { AbstractHttpLibrary, IHttpLibrary } from "./http-library";
import { AbstractHttpMiddleware, IHttpMiddleware } from "./http-middleware";
import {
  HttpServerConfiguration,
  IHttpServerConfiguration,
} from "./http-server-configuration";
import { IsomorphicFetchHttpLibrary as DefaultHttpLibrary } from "./isomorphic-fetch-http-library";

export interface IHttpConfiguration {
  readonly baseServer: IHttpServerConfiguration;
  readonly httpApi: IHttpLibrary;
  readonly middleware: IHttpMiddleware[];
  readonly authMethods: any;
}

export abstract class AbstractHttpConfiguration
  extends CustomUtilityClass
  implements IHttpConfiguration
{
  public constructor() {
    super(Tokens.HTTP_CONFIG);
  }

  abstract get baseServer(): HttpServerConfiguration;
  abstract get httpApi(): AbstractHttpLibrary;
  abstract get middleware(): AbstractHttpMiddleware[];
  abstract get authMethods(): any;
}

@injectable()
export class HttpConfiguration extends AbstractHttpConfiguration {
  public httpApi: AbstractHttpLibrary = new DefaultHttpLibrary();
  public middleware: AbstractHttpMiddleware[] = [];
  public authMethods: any = {};

  constructor(
    @inject(HttpServerConfiguration)
    @optional()
    public baseServer: HttpServerConfiguration,
    @inject(AbstractHttpLibrary) @optional() httpApi: AbstractHttpLibrary,
    @multiInject(AbstractHttpMiddleware)
    @optional()
    middleware: AbstractHttpMiddleware[] = []
    /*@multiInject(AbstractAuthMethod)
    @optional()
    securityConfiguration: AbstractHttpAuthMethod[] = []*/
  ) {
    super();

    httpApi && (this.httpApi = httpApi);

    for (const _middleware of middleware) {
      this.middleware.push(_middleware);
    }

    /*for (const authMethod of securityConfiguration) {
      const authName = authMethod.getName();
      // @ts-ignore
      if (authMethodServices[authName] !== undefined) {
        // @ts-ignore
        this.authMethods[authName] = authMethod;
      }
    }*/
  }
}
