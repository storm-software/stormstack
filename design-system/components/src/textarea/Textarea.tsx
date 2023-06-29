"use client";

import { isEmptyObject } from "@open-system/core-utilities";
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
import { InputAutoCompleteTypes, InputProps } from "../input";
import { FieldReference } from "../types";
import {
  getInputFillColor,
  getInputTextStyle,
  getStrokeStyle,
} from "../utilities/field-style-utils";
import { TextareaSizes } from "./Textarea.types";

export type TextareaProps = Omit<
  InputProps,
  "type" | "min" | "max" | "pattern" | "multiple"
> & {
  size?: TextareaSizes;
};

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
      glow = false,
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
      onChange,
      onFocus,
      onBlur,
      value,
      errors,
      warning,
      size = TextareaSizes.SMALL,
      ...props
    }: TextareaProps,
    ref: ForwardedRef<FieldReference<string>>
  ) => {
    const [focused, setFocused] = useState<boolean>(false);
    const handleFocus = useCallback(() => {
      if (!disabled) {
        setFocused(true);
        onFocus?.();
      }
    }, [disabled, onFocus]);

    const handleBlur = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement>) => {
        setFocused(false);
        onBlur && onBlur(event);
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
        disabled={disabled}
        required={required}
        noBorder={noBorder}
        heightClassName={
          size === TextareaSizes.SMALL
            ? "h-[9rem]"
            : size === TextareaSizes.MEDIUM
            ? "h-[13rem]"
            : "h-[19rem]"
        }>
        <textarea
          id={name}
          name={name}
          ref={ref as any}
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
            "flex w-full resize-none rounded-xl font-label-1 leading-label-1 transition-colors focus:ring-0 focus:ring-active focus:ring-offset-0",
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
            },
            className,
            { "h-[5rem]": size === TextareaSizes.SMALL },
            { "h-[9rem]": size === TextareaSizes.MEDIUM },
            { "h-[15rem]": size === TextareaSizes.LARGE }
          )}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={disabled}
          // required={required}
          minLength={minLength}
          maxLength={maxLength}
          tabIndex={tabIndex}
          inputMode={inputMode}
          autoCorrect={
            autoCorrect ? InputAutoCompleteTypes.ON : InputAutoCompleteTypes.OFF
          }
          autoFocus={autoFocus}
          autoComplete={
            autoComplete === false
              ? InputAutoCompleteTypes.OFF
              : typeof autoComplete === "boolean"
              ? InputAutoCompleteTypes.ON
              : autoComplete
          }
          spellCheck={spellCheck}
          aria-invalid={!isEmptyObject(errors)}
          aria-required={required}
          aria-disabled={disabled}
          onInput={onChange}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}></textarea>
      </FieldWrapper>
    );
  }
);
