"use client";

import { isEmptyObject } from "@open-system/core-utilities";
import clsx from "clsx";
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useCallback,
  useState,
} from "react";
import { FieldWrapper } from "../field-wrapper";
import { FieldLabelPlacementTypes } from "../field-wrapper/FieldWrapper.types";
import { BaseFieldProps } from "../types";
import {
  getFieldTextStyle,
  getInputFillColor,
  getStrokeStyle,
} from "../utilities/field-style-utils";

export type CheckboxProps = BaseFieldProps;

/**
 * The base Checkbox component used by the Open System repository
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      name,
      info = null,
      disabled = false,
      required = false,
      noBorder = false,
      glow = true,
      label,
      tabIndex,
      autoFocus = false,
      onChange,
      onFocus,
      onBlur,
      value,
      errors,
      warning,
      ...props
    }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [focused, setFocused] = useState<boolean>(false);
    const handleFocus = useCallback(() => {
      if (!disabled) {
        setFocused(true);
        onFocus?.();
      }
    }, [disabled, onFocus]);

    const handleBlur = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(event);
      },
      [onBlur]
    );

    return (
      <FieldWrapper
        name={name}
        label={label}
        ripple={false}
        info={info}
        errors={errors}
        warning={warning}
        focused={focused}
        disabled={disabled}
        required={required}
        noBorder={noBorder}
        labelPlacement={FieldLabelPlacementTypes.RIGHT}
        noDisabledIcon={true}
        className={clsx("w-fit", className)}
        heightClassName="h-16">
        <input
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
              "focus:shadow-active-glow": focused && glow,
            },
            "max-w-6 flex h-6 w-6 rounded-md font-label-1 leading-label-1 transition-colors focus:ring-0 focus:ring-offset-0",
            disabled
              ? "text-input-fill"
              : getFieldTextStyle(
                  !isEmptyObject(errors),
                  !!warning,
                  !!info,
                  false
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
          type="checkbox"
          disabled={disabled}
          readOnly={disabled}
          required={required}
          tabIndex={tabIndex}
          autoFocus={autoFocus}
          aria-invalid={!isEmptyObject(errors)}
          aria-required={required}
          aria-disabled={disabled}
          onInput={onChange}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}></input>
      </FieldWrapper>
    );
  }
);
