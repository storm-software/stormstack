/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueIdGenerator } from "../crypto/unique-id-generator";
import { IBaseClass } from "../types";
import { DateTime } from "./date-time";

const BASE_CLASS_SYMBOL = Symbol.for("BaseClass");

/**
 * A base abstract class to be inherited by all utility classes added.
 *
 * @remarks This class implements core functionality such as the id and symbol properties
 */
export abstract class BaseClass implements IBaseClass {
  #symbol: symbol;

  public constructor(symbol: symbol) {
    this.#symbol = symbol;
  }

  /**
   * Get a symbol representing the class type
   */
  public static isBaseClass(obj: any): boolean {
    return (
      BaseClass.getBaseSymbol === (obj as BaseClass)?.getBaseSymbol ||
      obj instanceof BaseClass
    );
  }

  /**
   * Internal identifier field used by architecture to identify the specific object
   */
  protected __id = UniqueIdGenerator.snowflake();

  /**
   * Internal timestamp field used to identify the time this specific object instance was initialized
   */
  protected readonly __timestamp: DateTime = DateTime.current;

  /**
   * The string identifier of this specific class type
   */
  public get __typename(): string {
    return (this as unknown as object)?.constructor.name;
  }

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public abstract get __base(): string;

  /**
   * Returns back a hash code to identify this specific instance
   *
   * @remarks The combination of class name and Id
   */
  public getHashCode = () =>
    `${(this as unknown as BaseClass)?.__typename ?? ""}-${
      (this as unknown as BaseClass)?.__id ?? ""
    }`;

  /**
   * The `isEqualInstance` method is comparing the hash codes of two instances of the `BaseUtilityClass`
   * class. It takes another instance of `BaseClass` as a parameter and checks if the hash code of
   * the current instance is equal to the hash code of the other instance. If the hash codes are equal,
   * it means that the two instances are considered equal.
   *
   * @param other - The other instance of `BaseClass` to compare with
   * @returns A boolean value indicating if the two instances are equal
   */
  public isEqualInstance = (other: any): boolean =>
    this.getHashCode() === (other as BaseClass)?.getHashCode();

  /**
   * Get a symbol representing the class type
   */
  protected getSymbol(): symbol {
    return this.#symbol;
  }

  /**
   * Get a symbol representing the class type
   */
  protected get getBaseSymbol(): symbol {
    return BASE_CLASS_SYMBOL;
  }

  public static getBaseSymbol = BASE_CLASS_SYMBOL;
}
