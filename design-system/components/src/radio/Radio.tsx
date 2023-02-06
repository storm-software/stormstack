"use client";

import { isEmptyObject } from "@open-system/core-typescript-utilities";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useCallback,
  useState,
} from "react";
import { FieldWrapper } from "../field-wrapper";
import { BaseFieldProps } from "../types";
import {
  getInputFillColor,
  getInputTextStyle,
  getStrokeStyle,
} from "../utilities/field-style-utils";
import { RadioOption } from "./Radio.types";

export type RadioProps = BaseFieldProps & {
  /**
   * Placeholder text when the field value is empty
   */
  placeholder?: string;

  /**
   * A list of options to display in the dropdown
   */
  options?: RadioOption[];

  /**
   * An indicator specifying if the radio options should be displayed vertically (default is horizontally)
   */
  isVertical?: boolean;
};

/**
 * The base Input component used by the Open System repository
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      name,
      value,
      options = [],
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
      isVertical = false,
      onChange,
      onFocus,
      onBlur,
      ...props
    }: RadioProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [focused, setFocused] = useState<boolean>(false);
    const handleFocus = useCallback(() => {
      setFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(event);
      },
      [onBlur]
    );

    return (
      <FieldWrapper
        className={clsx(
          className,
          { "h-[85px]": !isVertical },
          { "h-fit": isVertical }
        )}
        name={name}
        label={label}
        info={info}
        errors={errors}
        warning={warning}
        focused={focused}
        disabled={disabled}
        required={required}
        noBorder={noBorder}>
        <div
          className={clsx(
            "flex gap-6 pl-[3px]",
            { "flex-row": !isVertical },
            { "flex-col": isVertical },
            { "pt-4": label }
          )}>
          {options.map((option: RadioOption, i: number) => (
            <div
              key={i}
              className={clsx("flex w-full flex-row items-center gap-4", {
                "justify-between": isVertical,
              })}>
              <label
                className={clsx(
                  "transition",
                  getInputTextStyle(
                    isEmptyObject(errors),
                    !!warning,
                    !!info,
                    focused && (!value || option.value === value),
                    disabled,
                    option.value === value ? value : null
                  )
                )}
                htmlFor={option.value}>
                {option.name}
              </label>
              <input
                type="radio"
                id={option.value}
                name={name}
                ref={ref}
                className={clsx(
                  getStrokeStyle(
                    isEmptyObject(errors),
                    !!warning,
                    !!info,
                    focused,
                    disabled
                  ),
                  getInputFillColor(disabled),
                  {
                    "ring-1 ring-active ring-offset-0": focused,
                  },
                  {
                    "focus:shadow-active-glow": focused && glow,
                  },
                  "max-w-5 flex h-5 w-5 cursor-pointer rounded-full font-label-1 leading-label-1 transition focus:ring-0 focus:ring-active focus:ring-offset-0 disabled:bg-disabled-fill",
                  getInputTextStyle(
                    isEmptyObject(errors),
                    !!warning,
                    !!info,
                    focused,
                    disabled,
                    value
                  ),
                  { "border-3": disabled },
                  {
                    "border-1 shadow-sm duration-300 ease-in-out hover:shadow-active-glow":
                      !disabled && glow,
                  },
                  { "scale-110": option.value === value }
                )}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                tabIndex={tabIndex}
                autoFocus={autoFocus}
                aria-disabled={disabled}
                onInput={onChange}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          ))}
        </div>
      </FieldWrapper>
    );
  }
);
