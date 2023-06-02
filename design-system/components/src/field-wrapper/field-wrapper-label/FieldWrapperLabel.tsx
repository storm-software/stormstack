"use client";

import { isEmptyObject } from "@open-system/core-utilities";
import clsx from "clsx";
import { FocusEvent, useCallback } from "react";
import { PropsWithBase } from "../../types";
import { getFieldTextStyle } from "../../utilities/field-style-utils";
import { FieldWrapperProps } from "../FieldWrapper";

export type FieldWrapperLabelProps = PropsWithBase<
  Pick<
    FieldWrapperProps,
    "name" | "label" | "info" | "errors" | "warning" | "focused" | "required"
  > & { handleFocused: (event?: FocusEvent<any>) => void }
>;

/**
 * The base FieldWrapperLabel component used by the Open System repository.
 * This component is used to wrap all the form input field elements.
 */
export const FieldWrapperLabel = ({
  name,
  label = "",
  info = null,
  errors = null,
  warning = null,
  focused = false,
  handleFocused,
  required = false,
}: FieldWrapperLabelProps) => {
  const handleClick = useCallback(
    (event?: any) => handleFocused?.(event),
    [handleFocused]
  );

  return (
    <div
      onClick={handleClick}
      className="flex grow flex-row gap-xxxs whitespace-normal pl-xxxs">
      <label
        className={clsx(
          getFieldTextStyle(!isEmptyObject(errors), !!warning, !!info, focused),
          "pointer-events-none text-label-1 font-label-1 leading-label-1 antialiased",
          { "font-bold": !isEmptyObject(errors) }
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
