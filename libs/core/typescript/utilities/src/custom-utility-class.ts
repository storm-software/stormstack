import { getUUID } from "./get-unique-id";

/**
 * A base abstract class to be inherited by all utility classes added.
 *
 * @remarks This class implements core functionality such as the id and symbol properties
 */
export abstract class CustomUtilityClass implements ICustomUtilityClass {
  public constructor(public readonly _symbol: symbol) {
    this._type = (this as unknown as object)?.constructor.name;
  }

  /**
   * Internal identifier field used by architecture to identify the specific object
   */
  public _id = getUUID();

  /**
   * The string identifier of this specific class type
   */
  public readonly _type: string;

  /**
   * Returns back a hash code to identify this specific instance
   *
   * @remarks The combination of class name and Id
   */
  public getHashCode = () => `${this._type}-${this._id}`;
}
