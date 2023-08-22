"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import clsx from "clsx";
import { PropsWithBase } from "../types";

export type FieldTextProps = PropsWithBase<{
  /**
   * The field name displayed above the field value
   */
  name?: string;

  /**
   * A default value to display when no field value are provided
   *
   * @example "N/A"
   */
  placeholder?: string;

  hideWhenEmpty?: boolean;
}>;

/**
 * A component used to display a field value (and optionally a field name)
 */
export const FieldText = ({
  className,
  children,
  name,
  placeholder = " ",
  hideWhenEmpty = false,
}: FieldTextProps) => {
  const value = children ?? placeholder;

  return (
    <>
      {(!hideWhenEmpty ||
        !value ||
        (typeof value === "string" && !value.trim().length)) && (
        <div className="flex flex-col hyphens-auto break-all">
          {name && (
            <p className="hyphens-auto font-label-3 text-xs font-bold text-slate-500">
              {name}
            </p>
          )}
          {typeof value === "string" ? (
            <p
              className={clsx(
                "text-md text-primary hyphens-auto font-body-1",
                {
                  "h-8": !children && name,
                },
                className
              )}>
              {value}
            </p>
          ) : (
            value
          )}
        </div>
      )}
    </>
  );
};
