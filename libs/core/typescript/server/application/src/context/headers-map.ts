/**
 * A container for the HTTP headers sent to the server in the request.
 */
export class HeaderMap extends Map<string, string> {
  public static normalize = (
    headers: Headers | Record<string, string | string[] | undefined>
  ): HeaderMap => {
    const headerMap = new HeaderMap();

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

  private __identity = Symbol("HeaderMap");

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
}
