"use client";

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
}>;

/**
 * A component used to display a field value (and optionally a field name)
 */
export const FieldText = ({
  className,
  children,
  name,
  placeholder = " ",
}: FieldTextProps) => {
  const value = children ?? placeholder;

  return (
    <div className="flex flex-col">
      {name && (
        <label className="font-label-3 text-xs font-bold text-slate-500">
          {name}
        </label>
      )}
      {typeof value === "string" ? (
        <label
          className={clsx(
            "text-md font-body-1 text-primary",
            {
              "h-5": !value,
            },
            className
          )}>
          {value}
        </label>
      ) : (
        value
      )}
    </div>
  );
};
