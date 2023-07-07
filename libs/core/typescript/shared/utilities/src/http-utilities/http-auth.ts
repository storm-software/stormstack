import { RequestContext } from "./request-context";

/**
 * Interface authentication schemes.
 */
export interface SecurityAuthentication {
  /*
   * @return returns the name of the security authentication as specified in OAI
   */
  getName(): string;

  /**
   * Applies the authentication scheme to the request context
   *
   * @params context the request context which should use this authentication scheme
   */
  applySecurityAuthentication(context: RequestContext): void | Promise<void>;
}

export const AuthApiKey = Symbol("auth.api_key");
export const AuthUsername = Symbol("auth.username");
export const AuthPassword = Symbol("auth.password");

export interface TokenProvider {
  getToken(): Promise<string> | string;
}

export abstract class AbstractTokenProvider implements TokenProvider {
  public abstract getToken(): string | Promise<string>;
}

export type ApiKeyConfiguration = string;
export type HttpBasicConfiguration = { username: string; password: string };
export type HttpBearerConfiguration = { tokenProvider: TokenProvider };
export type OAuth2Configuration = { accessToken: string };
