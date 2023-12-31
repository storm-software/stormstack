"use client";

import { isEmptyObject } from "@stormstack/core-shared-utilities";
import clsx from "clsx";
import { PropsWithBase } from "../../types";
import { getFieldTextStyle } from "../../utilities/field-style-utils";
import { FieldWrapperProps } from "../FieldWrapper";

export type FieldWrapperLabelProps = PropsWithBase<
  Pick<
    FieldWrapperProps,
    "name" | "label" | "info" | "errors" | "warning" | "focused" | "required"
  >
>;

/**
 * The base FieldWrapperLabel component used by the Open System repository.
 * This component is used to wrap all the form input field elements.
 */
export const FieldWrapperLabel = ({
  name,
  label = "",
  className,
  info = null,
  errors = null,
  warning = null,
  focused = false,
  required = false
}: FieldWrapperLabelProps) => {
  return (
    <>
      <label
        className={clsx(
          getFieldTextStyle(!isEmptyObject(errors), !!warning, !!info, focused),
          "text-label-1 leading-label-1 transition-all font-label-1 antialiased",
          { "font-bold": !isEmptyObject(errors) },
          { "text-lg": focused },
          className
        )}
        htmlFor={name}>
        {label}
      </label>
      {label && required && (
        <label
          className="font-extrabold leading-none text-red-500 p-[1px]"
          htmlFor={name}>
          *
        </label>
      )}
    </>
  );
};
