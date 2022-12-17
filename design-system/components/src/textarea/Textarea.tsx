"use client";

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
import { InputAutoCompleteTypes, InputProps } from "../input";
import { FieldReference } from "../types";
import {
  getInputFillColor,
  getInputTextStyle,
  getStrokeStyle,
} from "../utilities/field-style-utils";

export type TextareaProps = Omit<
  InputProps,
  "type" | "min" | "max" | "pattern" | "multiple"
> & {};

/**
 * The base Input component used by the Open System repository
 */
export const Textarea = forwardRef<FieldReference<string>, TextareaProps>(
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
      placeholder,
      minLength,
      maxLength,
      tabIndex,
      inputMode,
      autoCorrect = false,
      autoComplete = InputAutoCompleteTypes.ON,
      autoFocus = false,
      spellCheck = true,
      onChanged,
      onFocus,
      onBlur,
    }: TextareaProps,
    ref: ForwardedRef<FieldReference<string>>
  ) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [value, setValue] = useState<string | null>(null);
    const [focused, setFocused] = useState<boolean>(false);

    const handleChanged = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement>) => {
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
        value: value ? value : null,
        setValue: (nextValue: string | null) => {
          setValue(nextValue ? nextValue : null);
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
        noBorder={noBorder}>
        <textarea
          id={name}
          name={name}
          ref={innerRef}
          className={clsx(
            getStrokeStyle(error, warning, info, focused, disabled),
            getInputFillColor(disabled),
            {
              "ring-1 ring-active ring-offset-0": focused,
            },
            {
              "focus:shadow-active-glow": focused && glow,
            },
            "flex w-full resize-none rounded-xl font-label-1 leading-label-1 transition-colors focus:ring-0 focus:ring-active focus:ring-offset-0",
            getInputTextStyle(error, warning, info, focused, disabled, value),
            { "border-3": disabled },
            {
              "border-1 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-active-glow":
                !disabled && glow,
            },
            className
          )}
          value={value ?? undefined}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={disabled}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          tabIndex={tabIndex}
          inputMode={inputMode}
          autoCorrect={autoCorrect ? "on" : "off"}
          autoFocus={autoFocus}
          autoComplete={
            autoComplete === false
              ? InputAutoCompleteTypes.OFF
              : typeof autoComplete === "boolean"
              ? InputAutoCompleteTypes.ON
              : autoComplete
          }
          spellCheck={spellCheck}
          aria-invalid={!!error}
          aria-required={required}
          aria-disabled={disabled}
          onInput={handleChanged}
          onChange={handleChanged}
          onFocus={handleFocus}
          onBlur={handleBlur}></textarea>
      </FieldWrapper>
    );
  }
);
