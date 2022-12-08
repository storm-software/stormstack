"use client";

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { BaseFieldProps, FieldReference } from "../types";
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
export const Select = forwardRef<FieldReference<string>, SelectProps>(
  (
    {
      className,
      name,
      options = [],
      info = null,
      disabled = false,
      required = false,
      noBorder = false,
      label,
      placeholder,
      tabIndex,
      autoFocus = false,
      onChanged,
      onFocus,
      onBlur,
    }: SelectProps,
    ref: ForwardedRef<FieldReference<string>>
  ) => {
    const innerRef = useRef<HTMLSelectElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [value, setValue] = useState<string | null>(null);
    const [focused, setFocused] = useState<boolean>(false);

    const handleChanged = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        const nextValue: string | null = event?.target?.value ?? null;
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

    useImperativeHandle<FieldReference<string>, FieldReference<string>>(
      ref,
      () => ({
        error,
        setError,
        warning,
        setWarning,
        value: value || typeof value === "number" ? value : null,
        setValue: (nextValue: string | null) => {
          setValue(
            nextValue || typeof nextValue === "number" ? nextValue : null
          );
        },
        focus: () => {
          innerRef.current?.focus?.();
        },
        selectText: () => {},
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
        noBorder={noBorder}>
        <select
          id={name}
          name={name}
          ref={innerRef}
          className={clsx(
            getStrokeStyle(error, warning, info, focused, disabled),
            getInputFillColor(disabled),
            {
              "ring-active focus:shadow-active-glow ring-1 ring-offset-0":
                focused,
            },
            "font-label-1 leading-label-1 focus:ring-active disabled:bg-disabled-fill flex w-full cursor-pointer rounded-xl transition-colors focus:ring-0 focus:ring-offset-0",
            getInputTextStyle(error, warning, info, focused, disabled, value),
            { "border-3": disabled },
            {
              "border-1 hover:shadow-active-glow shadow-sm transition-shadow duration-300 ease-in-out":
                !disabled,
            }
          )}
          value={value ?? undefined}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          tabIndex={tabIndex}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          aria-required={required}
          aria-disabled={disabled}
          onInput={handleChanged}
          onChange={handleChanged}
          onFocus={handleFocus}
          onBlur={handleBlur}>
          {options.map((option: SelectOption) => (
            <option
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
