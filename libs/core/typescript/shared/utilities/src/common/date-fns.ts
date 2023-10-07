import { Temporal } from "@js-temporal/polyfill";
import { BaseError, BaseErrorCode } from "../errors";
import { DateTime } from "./date-time";

/**
 * Format a date time field
 * @param dateTime
 * @param options
 * @param timeZone
 * @returns
 */
export const formatDateTime = (
  dateTime?: DateTime | null,
  options: Partial<
    Temporal.ToStringPrecisionOptions & Temporal.ShowCalendarOption
  > = { smallestUnit: "milliseconds" },
  timeZone?: Temporal.TimeZoneLike
): string =>
  dateTime
    ? `${dateTime
        .toZonedDateTime({
          timeZone: timeZone ?? process.env["DEFAULT_TIMEZONE"] ?? "UTC",
          calendar: "gregory"
        })
        .toString(options)}`
    : "";

/**
 * Format a date time field into ISO format
 * @param dateTime
 * @param options
 * @param timeZone
 * @returns
 */
export const formatDateTimeISO = (
  dateTime?: DateTime | null,
  options: Partial<
    Temporal.ToStringPrecisionOptions & Temporal.ShowCalendarOption
  > = { smallestUnit: "milliseconds" },
  timeZone?: Temporal.TimeZoneLike
): string =>
  dateTime
    ? `${dateTime
        .toZonedDateTimeISO(
          timeZone ?? process.env["DEFAULT_TIMEZONE"] ?? "UTC"
        )
        .toString(options)}`
    : "";

/**
 * Format a date field
 * @param dateTime
 * @returns
 */
export const formatDate = (dateTime: DateTime = DateTime.current): string =>
  DateTime.from(dateTime)
    .toZonedDateTimeISO(
      dateTime.toZonedDateTime({
        timeZone: process.env["DEFAULT_TIMEZONE"]
          ? process.env["DEFAULT_TIMEZONE"]
          : "America/New_York",
        calendar: "gregory"
      })
    )
    .toPlainDate()
    .toString();

function validateDateTime(dateTimeString?: string) {
  dateTimeString =
    dateTimeString === null || dateTimeString === void 0
      ? void 0
      : dateTimeString.toUpperCase();

  if (!dateTimeString) {
    return false;
  }

  const RFC_3339_REGEX =
    /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;

  // Validate the structure of the date-string
  if (!RFC_3339_REGEX.test(dateTimeString)) {
    return false;
  }

  // Check if it is a correct date using the javascript Date parse() method.
  const time = Date.parse(dateTimeString);
  if (!time) {
    return false;
  }

  // Split the date-time-string up into the string-date and time-string part.
  // and check whether these parts are RFC 3339 compliant.
  const index = dateTimeString.indexOf("T");
  const dateString = dateTimeString.substr(0, index);
  const timeString = dateTimeString.substr(index + 1);
  return validateDate(dateString) && validateTime(timeString);
}

export const validateTime = (time?: string) => {
  time = time === null || time === void 0 ? void 0 : time.toUpperCase();

  if (!time) {
    return false;
  }

  const TIME_REGEX =
    /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
  return TIME_REGEX.test(time);
};

export const validateDate = (strDate: string) => {
  const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))$/;
  if (!RFC_3339_REGEX.test(strDate)) {
    return false;
  }
  // Verify the correct number of days for
  // the month contained in the date-string.
  const year = Number(strDate.substr(0, 4));
  const month = Number(strDate.substr(5, 2));
  const day = Number(strDate.substr(8, 2));
  switch (month) {
    case 2: // February
      if (isLeapYear(year) && day > 29) {
        return false;
      }
      if (!isLeapYear(year) && day > 28) {
        return false;
      }
      return true;
    case 4: // April
    case 6: // June
    case 9: // September
    case 11: // November
      if (day > 30) {
        return false;
      }
      break;
  }
  return true;
};

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export function parseDateTime(
  value: number | string | Date | DateTime
): DateTime {
  if (DateTime.isDateTime(value)) {
    return value;
  }

  if (typeof value === "string") {
    if (validateDateTime(value)) {
      return DateTime.create(value);
    }
    throw new BaseError(
      BaseErrorCode.type_error,
      `DateTime cannot represent an invalid date-time-string ${value}.`
    );
  }

  if (typeof value === "number") {
    try {
      return DateTime.create(value);
    } catch (e) {
      throw new BaseError(
        BaseErrorCode.type_error,
        "DateTime cannot represent an invalid Unix timestamp " + value
      );
    }
  }

  throw new BaseError(
    BaseErrorCode.invalid_arguments,
    "DateTime cannot be serialized from a non string, " +
      "non numeric or non Date type " +
      JSON.stringify(value)
  );
}
export { DateTime };
