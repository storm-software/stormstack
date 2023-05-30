import URLParse from "url-parse";
import { ConsoleLogger } from "../logging/consoleLogger;
import { HttpFetchApi, HttpMethod } from "../types";

/**
 * Represents the body of an outgoing HTTP request.
 */
export type RequestBody = undefined | string | FormData | URLSearchParams;

/**
 * Represents an HTTP request context
 */
export class RequestContext<T = any> {
  private headers: { [key: string]: string } = {};
  private body: RequestBody = undefined;

  public static create<T = any>(
    url: string,
    httpMethod: HttpMethod,
    body?: RequestBody,
    queryParams: { [key: string]: string } = {},
    headers: { [key: string]: string } = {},
    cookies: { [key: string]: string } = {}
  ): RequestContext<T> {
    const request = new RequestContext(url, httpMethod, queryParams);
    request.setBody(body);

    Object.entries(headers).forEach(([key, value]: [string, string]) => {
      request.setHeaderParam(key, value);
    });

    Object.entries(cookies).forEach(([key, value]: [string, string]) => {
      request.addCookie(key, value);
    });

    return request;
  }

  /**
   * Creates the request context using a http method and request resource url
   *
   * @param url url of the requested resource
   * @param httpMethod http method
   */
  protected constructor(
    private url: string,
    private httpMethod: HttpMethod,
    private queryParams: { [key: string]: string } = {}
  ) {}

  /*
   * Returns the url set in the constructor including the query string
   *
   */
  public getUrl(
    baseUrl: string,
    _api?: HttpFetchApi,
    _extraOptions?: any
  ): string {
    const url = new URLParse(
      `${(baseUrl?.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl) ?? ""}/${
        (this.url?.charAt(0) === "/" ? this.url.substring(1) : this.url) ?? ""
      }`,
      true
    );

    const queryObj = url.query;
    Object.entries(this.queryParams).forEach(
      ([key, value]: [string, string]) => {
        queryObj[key] = value;
        url.set("query", queryObj);
      }
    );

    return url.toString();
  }

  /**
   * Replaces the url set in the constructor with this url.
   *
   */
  public setUrl(url: string) {
    this.url = url;
  }

  /**
   * Sets the body of the http request either as a string or FormData
   *
   * Note that setting a body on a HTTP GET, HEAD, DELETE, CONNECT or TRACE
   * request is discouraged.
   * https://httpwg.org/http-core/draft-ietf-httpbis-semantics-latest.html#rfc.section.7.3.1
   *
   * @param body the body of the request
   */
  public setBody(body: RequestBody) {
    this.body = body;
  }

  /**
   * It returns the value of the private variable httpMethod.
   * @returns The HttpMethod enum.
   */
  public getHttpMethod(_api?: HttpFetchApi, _extraOptions?: any): HttpMethod {
    return this.httpMethod;
  }

  /**
   * It returns an object with a string key and a string value.
   * @returns An object with a key of 'Content-Type' and a value of 'application/json'
   */
  public getHeaders(
    _api?: HttpFetchApi,
    _extraOptions?: any
  ): { [key: string]: string } {
    return this.headers;
  }

  /**
   * Public getBody(): RequestBody {
   *     return this.body;
   *   }
   * @returns The body of the request.
   */
  public getBody(_api?: HttpFetchApi, _extraOptions?: any): RequestBody {
    return this.body;
  }

  /**
   * It takes a query parameter name and value, and adds it to the query object of the URL
   * @param {string} name - The name of the query parameter to set.
   * @param {string} value - The value of the query parameter.
   */
  public setQueryParam(name: string, value: string) {
    this.queryParams[name] = value;
  }

  /**
   * Sets a cookie with the name and value. NO check  for duplicate cookies is performed.
   * @param {string} name - The name of the cookie
   * @param {string} value - The value of the cookie.
   */
  public addCookie(name: string, value: string): void {
    if (!this.headers["Cookie"]) {
      this.headers["Cookie"] = "";
    }
    this.headers["Cookie"] += name + "=" + value + "; ";
  }

  /**
   * It sets the header parameter.
   * @param {string} key - The name of the header parameter.
   * @param {string} value - The value of the header.
   */
  public setHeaderParam(key: string, value: string): void {
    this.headers[key] = value;
  }

  public getRequestOptions(
    api?: HttpFetchApi,
    extraOptions?: any
  ): RequestInit {
    const method = this.getHttpMethod(api, extraOptions).toString();

    ConsoleLogger.debug(
      `Preparing request: ${method} (${this.getUrl("", api, extraOptions)})`
    );

    const request = {
      method: this.getHttpMethod(api, extraOptions).toString(),
      body: this.getBody(api, extraOptions) as any,
      headers: this.getHeaders(api, extraOptions),
      credentials: "include",
      mode: "cors",
      signal: api?.signal,
      ...extraOptions,
    };

    ConsoleLogger.debug(`Request details: ${JSON.stringify(request)}`);

    return request;
  }
}
