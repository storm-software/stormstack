export abstract class AbstractCookieParser<T> {
  /**
   * Convert a json object to a string stored in a cookie
   * @param objData - The json object
   */
  public abstract toString(objData: T): string;

  /**
   * Parse the cookie string to create a json object
   * @param strData - The cookie string
   */
  public abstract toJson(strData: string): T;
}
