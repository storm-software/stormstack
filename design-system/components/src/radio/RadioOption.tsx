"use client";

import { isEmptyObject } from "@open-system/core-utilities";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import {
  ChangeEvent,
  FocusEvent,
  ForwardedRef,
  forwardRef,
  useCallback,
} from "react";
import { BaseFieldProps } from "../types";
import {
  getInputFillColor,
  getInputTextStyle,
  getStrokeStyle,
} from "../utilities/field-style-utils";
import { useRadioContext } from "./use-radio-context";

/**
 * The base Input component used by the Open System repository
 */
export const RadioOption = forwardRef<HTMLInputElement, BaseFieldProps>(
  (
    {
      className,
      name,
      value,
      info = null,
      errors,
      warning,
      disabled = false,
      required = false,
      noBorder = false,
      glow = true,
      label,
      placeholder,
      tabIndex,
      autoFocus = false,
      onChange,
      onFocus,
      onBlur,
      ...props
    }: BaseFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const context = useRadioContext();

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        event.stopPropagation();

        context.onFocus?.(event);
        onFocus?.();
      },
      [context, onFocus]
    );

    const handleBlur = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();

        context.onBlur?.(event);
        onBlur?.(event);
      },
      [context, onBlur]
    );

    return (
      <div
        className={clsx("flex w-full flex-row items-center gap-4", {
          "justify-between": context.isVertical,
        })}>
        <label
          className={clsx(
            "transition",
            getInputTextStyle(
              !isEmptyObject(context.errors),
              !!context.warning,
              !!context.info,
              context.focused && (!context.value || value === context.value),
              disabled || context.disabled,
              value === context.value ? context.value : null
            )
          )}
          htmlFor={value}>
          {name}
        </label>
        <input
          type="radio"
          id={value}
          name={context.name}
          ref={ref}
          value={value}
          className={clsx(
            getStrokeStyle(
              !isEmptyObject(context.errors),
              !!context.warning,
              !!context.info,
              context.focused,
              disabled || context.disabled
            ),
            getInputFillColor(!!(disabled || context.disabled)),
            {
              "ring-1 ring-active ring-offset-0": context.focused,
            },
            {
              "focus:shadow-active-glow": context.focused && context.glow,
            },
            "max-w-5 flex h-5 w-5 cursor-pointer rounded-full font-label-1 leading-label-1 transition focus:ring-0 focus:ring-active focus:ring-offset-0 disabled:bg-disabled-fill",
            getInputTextStyle(
              !isEmptyObject(errors),
              !!context.warning,
              !!context.info,
              context.focused,
              disabled || context.disabled,
              value === context.value
            ),
            { "border-3": disabled || context.disabled },
            {
              "border-1 shadow-sm duration-300 ease-in-out hover:shadow-active-glow":
                !disabled && !context.disabled && context.glow,
            },
            { "scale-110": value === context.value }
          )}
          disabled={disabled || context.disabled}
          tabIndex={tabIndex}
          autoFocus={autoFocus}
          aria-disabled={disabled || context.disabled}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    );
  }
);
