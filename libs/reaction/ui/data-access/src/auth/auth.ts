import { injectable, inject, named } from "inversify";
import {
  RequestContext,
  ApiKeyConfiguration,
  HttpBasicConfiguration,
  HttpBearerConfiguration,
  OAuth2Configuration,
  AbstractTokenProvider,
  SecurityAuthentication,
  AuthApiKey,
  AuthUsername,
  AuthPassword
} from "@open-system/core-utilities";
import type {
  TokenProvider
} from "@open-system/core-utilities";


export type AuthMethods = {
}

export const authMethodServices = {
}

export type AuthMethodsConfiguration = {
}

/**
 * Creates the authentication methods from a swagger description.
 *
 */
export function configureAuthMethods(config: AuthMethodsConfiguration | undefined): AuthMethods {
    const authMethods: AuthMethods = {}

    if (!config) {
        return authMethods;
    }

    return authMethods;
}
