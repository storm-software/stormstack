import URLParse from "url-parse";
import { HttpMethod } from "../types";

/**
 * Represents the body of an outgoing HTTP request.
 */
export type RequestBody = undefined | string | FormData | URLSearchParams;

/**
 * Represents an HTTP request context
 */
export class RequestContext {
  private headers: { [key: string]: string } = {};
  private body: RequestBody = undefined;
  private url: URLParse<Record<string, string | undefined>>;

  /**
   * Creates the request context using a http method and request resource url
   *
   * @param url url of the requested resource
   * @param httpMethod http method
   */
  public constructor(url: string, private httpMethod: HttpMethod) {
    this.url = new URLParse(url, true);
  }

  /*
   * Returns the url set in the constructor including the query string
   *
   */
  public getUrl(): string {
    return this.url.toString();
  }

  /**
   * Replaces the url set in the constructor with this url.
   *
   */
  public setUrl(url: string) {
    this.url = new URLParse(url, true);
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
  public getHttpMethod(): HttpMethod {
    return this.httpMethod;
  }

  /**
   * It returns an object with a string key and a string value.
   * @returns An object with a key of 'Content-Type' and a value of 'application/json'
   */
  public getHeaders(): { [key: string]: string } {
    return this.headers;
  }

  /**
   * Public getBody(): RequestBody {
   *     return this.body;
   *   }
   * @returns The body of the request.
   */
  public getBody(): RequestBody {
    return this.body;
  }

  /**
   * It takes a query parameter name and value, and adds it to the query object of the URL
   * @param {string} name - The name of the query parameter to set.
   * @param {string} value - The value of the query parameter.
   */
  public setQueryParam(name: string, value: string) {
    const queryObj = this.url.query;
    queryObj[name] = value;
    this.url.set("query", queryObj);
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
}
