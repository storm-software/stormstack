import { inject, injectable, multiInject, optional, interfaces } from "inversify";
import { servers } from "../servers";
// import { authMethodServices, AuthMethods } from "../auth/auth";
import {
  HttpServerConfiguration,
  AbstractHttpLibrary,
  AbstractHttpMiddleware,
  HttpFile,
  RequestContext,
  ResponseContext,
  AbstractHttpConfiguration,
  HttpConfiguration
} from '@open-system/core-typescript-utilities';

import * as apis from "../apis/ObjectParamAPI";
import * as apiServices from "./ObjectParamAPI";
import {
  AbstractReactionApiRequestFactory,
  AbstractReactionApiResponseProcessor
} from "./ReactionApi.service";
import {
  ReactionApiRequestFactory,
  ReactionApiResponseProcessor
} from "../parsers/ReactionApi";

/**
 * Helper class to simplify binding the services
 */
export class ApiServiceBinder {
  public static with(
    container: interfaces.Container
  ): ApiServiceBinder {
    const apiServiceBinder = new ApiServiceBinder(container);
    apiServiceBinder.bindServerConfigurationToPredefined(0);
    apiServiceBinder.bindAllApiServices();

    return apiServiceBinder;
  }

  protected constructor(private container: interfaces.Container) {
    this.container.bind(AbstractHttpConfiguration).to(HttpConfiguration);
  }


    /**
     * Allows you to bind a server configuration without having to import the service identifier.
     */
    public get bindServerConfiguration() {
        return this.container.bind(HttpServerConfiguration);
    }

    /**
     * Use one of the predefined server configurations.
     *
     * To customize the server variables you can call `setVariables` on the
     * return value;
     */
    public bindServerConfigurationToPredefined(idx: number) {
        this.bindServerConfiguration.toConstantValue(servers[idx]);
        return servers[idx];
    }

    /**
     * Explicitly define the service base url
     */
    public bindServerConfigurationToURL(url: string) {
        return this.bindServerConfiguration.toConstantValue(
            new HttpServerConfiguration(url, {})
        );
    }

    /**
     * Allows you to bind a http library without having to import the service identifier.
     */
    public get bindHttpLibrary() {
      return this.container.bind(AbstractHttpLibrary);
    }

    /**
     * Allows you to bind a middleware without having to import the service identifier.
     *
     * You can bind multiple middlewares by calling this multiple method times.
     */
    public get bindMiddleware() {
        return this.container.bind(AbstractHttpMiddleware);
    }

    /**
     * Allows you to bind an auth method without having to import the service identifier.
     *
     * Note: The name of the bound auth method needs to be known in the specs,
     * because the name is used to decide for which endpoints to apply the authentication.
     */
    /* public get bindAuthMethod() {
        return this.container.bind(AbstractAuthMethod);
    }*/

    /**
     * Use one of the predefined auth methods.
     *
     * Make sure that you have injected all dependencies for it.
     */
    /*public bindAuthMethodToPredefined(name: keyof AuthMethods) {
        return this.bindAuthMethod.to(authMethodServices[name]);
    }*/

    /**
     * Bind all the apis to their respective service identifiers
     *
     * If you want to only bind some of the apis, you need to do that manually.
     */
    public bindAllApiServices() {

        this.container
          .bind(AbstractReactionApiRequestFactory)
          .to(ReactionApiRequestFactory)
          .inSingletonScope();
        this.container
          .bind(AbstractReactionApiResponseProcessor)
          .to(ReactionApiResponseProcessor)
          .inSingletonScope();

        this.container.bind(apiServices.AbstractObjectReactionApi).to(apis.ObjectReactionApi).inSingletonScope();
    }
}
