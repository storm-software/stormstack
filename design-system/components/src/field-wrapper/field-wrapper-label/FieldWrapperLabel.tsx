"use client";

import clsx from "clsx";
import { PropsWithBase } from "../../types";
import { getTextStyle } from "../../utilities/field-style-utils";
import { FieldWrapperProps } from "../FieldWrapper";

export type FieldWrapperLabelProps = PropsWithBase<
  Pick<
    FieldWrapperProps,
    "name" | "label" | "info" | "error" | "warning" | "focused" | "required"
  >
>;

/**
 * The base FieldWrapperLabel component used by the Open System repository.
 * This component is used to wrap all the form input field elements.
 */
export const FieldWrapperLabel = ({
  name,
  label = "",
  info = null,
  error = null,
  warning = null,
  focused = false,
  required = false,
}: FieldWrapperLabelProps) => {
  return (
    <div className="flex grow flex-row gap-xxxs whitespace-normal pl-xxxs">
      <label
        className={clsx(
          getTextStyle(error, warning, info, focused),
          "text-label-1 font-label-1 leading-label-1 antialiased"
        )}
        htmlFor={name}>
        {label}
      </label>
      {required && (
        <label
          className="font-extrabold leading-none text-red-500"
          htmlFor={name}>
          *
        </label>
      )}
    </div>
  );
};
