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
  useState,
} from "react";
import { FieldWrapper } from "../field-wrapper";
import { BaseFieldProps } from "../types";
import {
  getInputFillColor,
  getInputTextStyle,
  getStrokeStyle,
} from "../utilities/field-style-utils";
import { SelectOption } from "./Select.types";

export type SelectProps = BaseFieldProps & {
  /**
   * Placeholder text when the field value is empty
   */
  placeholder?: string;

  /**
   * A list of options to display in the dropdown
   */
  options?: SelectOption[];
};

/**
 * The base Input component used by the Open System repository
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      name,
      value,
      options = [],
      info = null,
      warning,
      errors,
      disabled = false,
      required = false,
      noBorder = false,
      glow = false,
      label,
      placeholder,
      tabIndex,
      autoFocus = false,
      onChange,
      onFocus,
      onBlur,
      ...props
    }: SelectProps,
    ref: ForwardedRef<HTMLSelectElement>
  ) => {
    const [focused, setFocused] = useState<boolean>(false);
    const handleFocus = useCallback((event?: FocusEvent<any>) => {
      if (!disabled) {
        setFocused(true);
        onFocus?.();
      }
    }, [disabled, onFocus]);

    const handleBlur = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        setFocused(false);
        onBlur?.(event);
      },
      [onBlur]
    );

    return (
      <FieldWrapper
        name={name}
        label={label}
        info={info}
        errors={errors}
        warning={warning}
        focused={focused}
        handleFocused={handleFocus}
        disabled={disabled}
        required={required}
        noBorder={noBorder}>
        <select
          id={name}
          name={name}
          ref={ref}
          className={clsx(
            getStrokeStyle(
              !isEmptyObject(errors),
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
            "flex w-full cursor-pointer rounded-xl font-label-1 leading-label-1 transition-colors focus:ring-0 focus:ring-active focus:ring-offset-0 disabled:bg-disabled-fill",
            getInputTextStyle(
              !isEmptyObject(errors),
              !!warning,
              !!info,
              focused,
              disabled,
              value
            ),
            { "border-3": disabled },
            {
              "border-1 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-active-glow":
                !disabled && glow,
            },
            {
              "hover:border-hover-link-2 hover:ring-0 hover:ring-hover-link-2 hover:ring-offset-0":
                !disabled,
            }
          )}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          tabIndex={tabIndex}
          autoFocus={autoFocus}
          aria-invalid={!isEmptyObject(errors)}
          aria-required={required}
          aria-disabled={disabled}
          onInput={onChange}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}>
          {options.map((option: SelectOption) => (
            <option
              key={option.value}
              label={option.name}
              disabled={option.disabled}
              value={option.value}
              selected={option.selected}>
              {option.name}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }
);
