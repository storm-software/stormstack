import { isFunction } from "@stormstack/core-shared-utilities";

/**
 * A container for the HTTP headers sent to the server in the request.
 */
export class HeadersMap extends Map<string, string> {
  public static normalize = (headers: Headers): HeadersMap => {
    const headerMap = new HeadersMap(headers);

    (headers instanceof Headers ? headers : Object.entries(headers)).forEach(
      (value, key) => {
        headerMap.set(
          String(key),
          Array.isArray(value) ? value.join(", ") : value
        );
      }
    );

    return headerMap;
  };

  public static isHeadersMap(obj: any): obj is HeadersMap {
    const headersMap = obj as HeadersMap;

    return (
      isFunction(headersMap.getHeaders) &&
      isFunction(headersMap.set) &&
      isFunction(headersMap.get) &&
      isFunction(headersMap.delete) &&
      isFunction(headersMap.has)
    );
  }

  constructor(public headers: Headers) {
    super();
  }

  public override set(key: string, value: string): this {
    return super.set(key.toLowerCase(), value);
  }

  public override get(key: string) {
    return super.get(key.toLowerCase());
  }

  public override delete(key: string) {
    return super.delete(key.toLowerCase());
  }

  public override has(key: string) {
    return super.has(key.toLowerCase());
  }

  public getHeaders(): Headers {
    return { ...this.headers, ...this };
  }
}
