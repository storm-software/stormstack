import { IBaseUtilityClass } from "../types";
import { getUniqueId } from "./get-unique-id";

/**
 * A base abstract class to be inherited by all utility classes added.
 *
 * @remarks This class implements core functionality such as the id and symbol properties
 */
export abstract class BaseUtilityClass implements IBaseUtilityClass {
  public constructor(public readonly _symbol: symbol) {
    this._type = (this as unknown as object)?.constructor.name;
  }

  /**
   * Internal identifier field used by architecture to identify the specific object
   */
  public _id = getUniqueId();

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

  /**
   * The `isEqualInstance` method is comparing the hash codes of two instances of the `BaseUtilityClass`
   * class. It takes another instance of `BaseUtilityClass` as a parameter and checks if the hash code of
   * the current instance is equal to the hash code of the other instance. If the hash codes are equal,
   * it means that the two instances are considered equal.
   *
   * @param other - The other instance of `BaseUtilityClass` to compare with
   * @returns A boolean value indicating if the two instances are equal
   */
  public isEqualInstance = (other: BaseUtilityClass): boolean =>
    this.getHashCode() === other.getHashCode();
}
