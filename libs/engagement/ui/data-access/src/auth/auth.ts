import type {
  TokenProvider
} from "@open-system/core-typescript-utilities";
import {
  AbstractTokenProvider,
  HttpBearerConfiguration,
  RequestContext,
  SecurityAuthentication
} from "@open-system/core-typescript-utilities";
import { inject, injectable, named } from "inversify";


/**
 * Applies http authentication to the request context.
 */
@injectable()
export class BearerTokenAuthentication implements SecurityAuthentication {
  /**
   * Configures the http authentication with the required details.
   *
   * @param tokenProvider service that can provide the up-to-date token when needed
   */
  public constructor(
    @inject(AbstractTokenProvider)
    @named("bearer-token")
    private tokenProvider: TokenProvider
  ) {}

  public getName(): string {
    return "bearer-token";
  }

  public async applySecurityAuthentication(context: RequestContext) {
    context.setHeaderParam(
      "Authorization",
      "Bearer " + (await this.tokenProvider.getToken())
    );
  }
}

export type AuthMethods = {
  "bearer-token"?: SecurityAuthentication;
};

export const authMethodServices = {
  "bearer-token": BearerTokenAuthentication,
};

export type AuthMethodsConfiguration = {
  "bearer-token"?: HttpBearerConfiguration;
};

/**
 * Creates the authentication methods from a swagger description.
 *
 */
export function configureAuthMethods(
  config: AuthMethodsConfiguration | undefined
): AuthMethods {
  const authMethods: AuthMethods = {};

  if (!config) {
    return authMethods;
  }

  if (config["bearer-token"]) {
    authMethods["bearer-token"] = new BearerTokenAuthentication(
      config["bearer-token"]["tokenProvider"]
    );
  }

  return authMethods;
}
