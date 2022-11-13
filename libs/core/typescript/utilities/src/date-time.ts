import { Temporal } from "@js-temporal/polyfill";
import { getUUID } from "./get-unique-id";
import { isBigInt, isDate } from "./type-check";

/**
 * A wrapper of the and Date class
 */
export class DateTime extends Temporal.Instant implements IDateTime {
  /**
   * Type-check to determine if `obj` is a javascript {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date | Date} object
   *
   * If the object is a Date, or if the object is a DateTime, or if the object is a DateTime and the
   * object's prototype's toString method's call method's first argument is the object and the object's
   * prototype's toString method's call method's second argument is the string "[object Date]", then
   * return true, otherwise return false.
   *
   * @param obj - the object to check
   * @returns The function isDateTime is returning a boolean value.
   */
  public static isJsDate(obj: unknown): obj is Date {
    return isDate(obj) || DateTime.isDateTime(obj);
  }

  /**
   * Type-check to determine if `obj` is a `DateTime` object
   *
   * `isDateTime` returns true if the object passed to it has a `_symbol` property that is equal to
   * `DATE_TIME_SYMBOL`
   *
   * @param obj - the object to check
   * @returns The function isDateTime is returning a boolean value.
   */
  public static isDateTime(obj: unknown): obj is IDateTime {
    return (obj as IDateTime)?._symbol === Tokens.DATE_TIME_SYMBOL;
  }

  /**
   * Conditional function to determine if `obj` is a valid `DateTime` object (i.e. the inner date value is set to a valid date and/or time)
   *
   * `isValid` is a function that takes an object of type `any` and returns a boolean
   *
   * @param {any} obj - any - the object to check
   * @returns A function that returns a boolean.
   */
  public static isValid(obj: unknown): obj is IDateTime {
    return (
      DateTime.isDateTime(obj) &&
      DateTime.isJsDate(obj) &&
      !isNaN(obj.getTime())
    );
  }

  /**
   * The current function returns a new DateTime object with the current date and time
   * @returns A new instance of DateTime with the current date and time.
   */
  public static get current(): DateTime {
    return new DateTime(Temporal.Now.instant());
  }

  /**
   * Get the duration between two dates.
   * @param {DateTime} dateTimeFrom - DateTime - The date and time to start the duration from.
   * @param {DateTime} dateTimeTo - DateTime = DateTime.current
   * @returns A Duration object.
   */
  public static getDuration(
    dateTimeFrom: DateTime,
    dateTimeTo: DateTime = DateTime.current
  ): Temporal.Duration {
    return dateTimeFrom.since(dateTimeTo);
  }

  public static create = (
    dateTime:
      | Temporal.Instant
      | string
      | bigint
      | Date
      | null
      | undefined = DateTime.current
  ) => new DateTime(dateTime);

  protected constructor(
    dateTime:
      | Temporal.Instant
      | string
      | bigint
      | Date
      | null
      | undefined = DateTime.current
  ) {
    super(
      isBigInt(dateTime)
        ? dateTime
        : Temporal.Instant.from(
            DateTime.isJsDate(dateTime) ? dateTime.toUTCString() : dateTime
          ).epochNanoseconds
    );
  }

  /**
   * It returns the duration between two dates.
   * @param {DateTime} dateTimeTo - DateTime = DateTime.current
   * @returns A duration object.
   */
  public getDuration(
    dateTimeTo: DateTime = DateTime.current
  ): Temporal.Duration {
    return DateTime.getDuration(this, dateTimeTo);
  }

  /**
   * Internal identifier field used by architecture to identify the specific object
   */
  public readonly _id = getUUID();

  /**
   * The string identifier of this specific class type
   */
  public readonly _type: string;

  /**
   * Readonly field used internally to identify if the object is a DateTime
   */
  public readonly _symbol = Tokens.DATE_TIME_SYMBOL;

  /**
   * Returns back a hash code to identify this specific instance
   *
   * @remarks The combination of class name and Id
   */
  public getHashCode = () => `${this._type}-${this._id}`;
}
