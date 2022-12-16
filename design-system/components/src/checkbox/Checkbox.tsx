"use client";

import clsx from "clsx";
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FieldWrapper } from "../field-wrapper";
import { FieldLabelPlacementTypes } from "../field-wrapper/FieldWrapper.types";
import { BaseFieldProps, FieldReference } from "../types";
import {
  getInputFillColor,
  getStrokeStyle,
  getTextStyle,
} from "../utilities/field-style-utils";

export type CheckboxProps = BaseFieldProps;

/**
 * The base Checkbox component used by the Open System repository
 */
export const Checkbox = forwardRef<FieldReference<boolean>, CheckboxProps>(
  (
    {
      className,
      name,
      info = null,
      disabled = false,
      required = false,
      noBorder = false,
      label,
      tabIndex,
      autoFocus = false,
      onChanged,
      onFocus,
      onBlur,
    }: CheckboxProps,
    ref: ForwardedRef<FieldReference<boolean>>
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [value, setValue] = useState<boolean>(false);
    const [focused, setFocused] = useState<boolean>(false);

    const handleChanged = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = !!event?.target?.value;
        if (nextValue !== value) {
          setValue(nextValue);
          onChanged?.(nextValue);
        }
      },
      [onChanged, value]
    );

    const handleFocus = useCallback(() => {
      setFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setFocused(false);
      onBlur?.();
    }, [onBlur]);

    useImperativeHandle<FieldReference<boolean>, FieldReference<boolean>>(
      ref,
      () => ({
        error,
        setError,
        warning,
        setWarning,
        value: !!value,
        setValue: (nextValue: boolean | null) => {
          setValue(!!nextValue);
        },
        focus: () => {
          innerRef.current?.focus?.();
        },
        selectText: () => {
          innerRef.current?.select?.();
        },
      }),
      [error, value, warning]
    );

    return (
      <FieldWrapper
        name={name}
        label={label}
        info={info}
        error={error}
        warning={warning}
        focused={focused}
        disabled={disabled}
        required={required}
        noBorder={noBorder}
        labelPlacement={FieldLabelPlacementTypes.RIGHT}
        noDisabledIcon={true}
        className={clsx("w-fit", className)}>
        <input
          id={name}
          name={name}
          ref={innerRef}
          className={clsx(
            getStrokeStyle(error, warning, info, focused, disabled),
            getInputFillColor(disabled),
            {
              "focus:shadow-active-glow": focused,
            },
            "max-w-6 flex h-6 w-6 rounded-md font-label-1 leading-label-1 transition-colors focus:ring-0 focus:ring-offset-0",
            disabled
              ? "text-input-fill"
              : getTextStyle(error, warning, info, false),
            { "border-3": disabled },
            {
              "border-1 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-active-glow":
                !disabled,
            }
          )}
          type="checkbox"
          value={value ? "true" : "false"}
          disabled={disabled}
          readOnly={disabled}
          required={required}
          tabIndex={tabIndex}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          aria-required={required}
          aria-disabled={disabled}
          onInput={handleChanged}
          onChange={handleChanged}
          onFocus={handleFocus}
          onBlur={handleBlur}></input>
      </FieldWrapper>
    );
  }
);
