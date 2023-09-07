import { IBaseUtilityClass } from "../types";
import { BaseClass } from "./base-class";

/**
 * A base abstract class to be inherited by all utility classes added.
 *
 * @remarks This class implements core functionality such as the id and symbol properties
 */
export abstract class BaseUtilityClass
  extends BaseClass
  implements IBaseUtilityClass
{
  public constructor(symbol: symbol) {
    super(symbol);
  }

  /**
   * Get a symbol representing the class type
   */
  public get __symbol(): symbol {
    return this.getSymbol();
  }
}
