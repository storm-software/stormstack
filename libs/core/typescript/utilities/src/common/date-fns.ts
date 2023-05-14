import { Temporal } from "@js-temporal/polyfill";
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
          timeZone: timeZone ?? process.env.DEFAULT_TIMEZONE ?? "UTC",
          calendar: "gregory",
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
        .toZonedDateTimeISO(timeZone ?? process.env.DEFAULT_TIMEZONE ?? "UTC")
        .toString(options)}`
    : "";
