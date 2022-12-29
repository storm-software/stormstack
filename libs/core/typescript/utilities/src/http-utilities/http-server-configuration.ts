import { injectable } from "inversify";
import { CustomUtilityClass } from "../common";
import { HttpMethod, Tokens } from "../types";
import { RequestContext } from "./request-context";

export interface IHttpServerConfiguration {
  makeRequestContext(endpoint: string, httpMethod: HttpMethod): RequestContext;
}

export abstract class AbstractHttpServerConfiguration<
    T extends { [key: string]: string } = Record<string, string>
  >
  extends CustomUtilityClass
  implements IHttpServerConfiguration
{
  public constructor(
    protected url: string,
    protected variableConfiguration: T = {} as T
  ) {
    super(Tokens.HTTP_SERVER_CONFIG);
  }

  public abstract makeRequestContext(
    endpoint: string,
    httpMethod: HttpMethod
  ): RequestContext;
}

/**
 *
 * Represents the configuration of a server including its
 * url template and variable configuration based on the url.
 *
 */
@injectable()
export class HttpServerConfiguration<
  T extends { [key: string]: string } = Record<string, string>
> extends AbstractHttpServerConfiguration {
  public constructor(
    protected url: string,
    protected variableConfiguration: T = {} as T
  ) {
    super(url, variableConfiguration);
  }

  /**
   * Sets the value of the variables of this server.
   *
   * @param variableConfiguration a partial variable configuration for the variables contained in the url
   */
  public setVariables(variableConfiguration: Partial<T>) {
    Object.assign(this.variableConfiguration, variableConfiguration);
  }

  public getConfiguration(): T {
    return this.variableConfiguration;
  }

  private getUrl() {
    let replacedUrl = this.url;
    for (const key in this.variableConfiguration) {
      replacedUrl = replacedUrl.replace(
        new RegExp("{" + key + "}", "g"),
        this.variableConfiguration[key]
      );
    }
    return replacedUrl;
  }

  /**
   * Creates a new request context for this server using the url with variables
   * replaced with their respective values and the endpoint of the request appended.
   *
   * @param endpoint the endpoint to be queried on the server
   * @param httpMethod httpMethod to be used
   *
   */
  public makeRequestContext(
    endpoint: string,
    httpMethod: HttpMethod
  ): RequestContext {
    return new RequestContext(this.getUrl() + endpoint, httpMethod);
  }
}
