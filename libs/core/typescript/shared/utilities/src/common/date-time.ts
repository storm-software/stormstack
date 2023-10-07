/* eslint-disable @typescript-eslint/no-explicit-any */
import { Temporal } from "@js-temporal/polyfill";
import { IDateTime, Tokens } from "../types";
import { isBigInt, isDate, isFunction, isNumber } from "./type-checks";
import { UniqueIdGenerator } from "./unique-id-generator";

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
    return isDate(obj);
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
    return (obj as IDateTime)?.__typename === "DateTime";
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
    return DateTime.isDateTime(obj);
  }

  /**
   * The current function returns a new DateTime object with the current date and time
   * @returns A new instance of DateTime with the current date and time.
   */
  public static get current(): DateTime {
    return DateTime.create(Temporal.Now.instant());
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

  /**
   * This function takes a DateTime object and returns a PlainDate object.
   * @param {DateTime} dateTime - DateTime
   * @returns A PlainDate object.
   */
  public static getPlainDate(
    dateTime: DateTime = DateTime.current
  ): Temporal.PlainDate {
    return Temporal.PlainDate.from(
      dateTime.toZonedDateTimeISO(Temporal.Now.timeZoneId())
    );
  }

  /**
   * This function takes a DateTime object and returns a PlainTime object.
   * @param {DateTime} dateTime - DateTime
   * @returns A PlainTime object.
   */
  public static getPlainTime(
    dateTime: DateTime = DateTime.current
  ): Temporal.PlainTime {
    return Temporal.PlainTime.from(
      dateTime.toZonedDateTimeISO(Temporal.Now.timeZoneId())
    );
  }

  public static create = (
    dateTime:
      | Temporal.Instant
      | string
      | number
      | bigint
      | Date
      | null
      | undefined = DateTime.current
  ) => new DateTime(dateTime);

  public static parse(strDateTime: string): IDateTime {
    return DateTime.create(Temporal.Instant.from(strDateTime));
  }

  public static stringify(dateTime: IDateTime): string {
    return dateTime.stringify();
  }

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public get __base(): string {
    return "DateTime";
  }

  protected constructor(
    dateTime:
      | Temporal.Instant
      | string
      | number
      | bigint
      | Date
      | null
      | undefined = DateTime.current
  ) {
    super(
      isBigInt(dateTime)
        ? dateTime
        : isNumber(dateTime)
        ? BigInt(dateTime)
        : DateTime.isDateTime(dateTime)
        ? dateTime.epochNanoseconds
        : DateTime.isJsDate(dateTime) && isFunction(dateTime.toISOString)
        ? Temporal.Instant.from(dateTime.toISOString()).epochNanoseconds
        : typeof dateTime === "string"
        ? Temporal.Instant.from(dateTime).epochNanoseconds
        : Temporal.Now.instant().epochNanoseconds
    );

    this.__typename = "DateTime"; // (this as unknown as object)?.constructor.name;
  }

  /**
   * It returns a plain date object from a DateTime object
   * @returns A PlainDate object.
   */
  public getPlainDate(): Temporal.PlainDate {
    return DateTime.getPlainDate(this);
  }

  /**
   * `getPlainTime` returns a `PlainTime` object from a `DateTime` object
   * @returns A PlainTime object.
   */
  public getPlainTime(): Temporal.PlainTime {
    return DateTime.getPlainTime(this);
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
   * It returns the current `DateTime` object as a JavaScript `Date` object
   * @returns A JavaScript `Date` object.
   */
  public asJsDate(): Date {
    return new Date(this.epochMilliseconds);
  }

  /**
   * It returns the current `DateTime` object as a string for serialization
   * @returns A `string` to use for serialization
   */
  public stringify(): string {
    return this.toString();
  }

  /**
   * Internal identifier field used by architecture to identify the specific object
   */
  public readonly __id = UniqueIdGenerator.generate();

  /**
   * The string identifier of this specific class type
   */
  public readonly __typename: string;

  /**
   * Readonly field used internally to identify if the object is a DateTime
   */
  public readonly __symbol = Tokens.DATE_TIME;

  /**
   * Returns back a hash code to identify this specific instance
   *
   * @remarks The combination of class name and Id
   */
  public getHashCode = () => `${this.__typename}-${this.__id}`;

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
    this.getHashCode() === (other as DateTime)?.getHashCode();
}
