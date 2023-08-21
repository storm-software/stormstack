import { IBaseUtilityClass } from "../types";
import { UniqueIdGenerator } from "./unique-id-generator";

/**
 * A base abstract class to be inherited by all utility classes added.
 *
 * @remarks This class implements core functionality such as the id and symbol properties
 */
export abstract class BaseUtilityClass implements IBaseUtilityClass {
  public constructor(public readonly _symbol: symbol) {}

  /**
   * Internal identifier field used by architecture to identify the specific object
   */
  public objectInstanceId = UniqueIdGenerator.generate();

  /**
   * Internal timestamp field used to identify the time this specific object instance was initialized
   */
  public readonly objectInstanceTimestamp: number = Date.now();

  /**
   * The string identifier of this specific class type
   */
  public get objectType(): string {
    return (this as unknown as object)?.constructor.name;
  }

  /**
   * Returns back a hash code to identify this specific instance
   *
   * @remarks The combination of class name and Id
   */
  public getHashCode = () => `${this.objectType}-${this.objectInstanceId}`;

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
