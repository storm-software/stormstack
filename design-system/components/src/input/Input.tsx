"use client";

import { isEmptyObject } from "@open-system/core-typescript-utilities";
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
import {
  InputAutoCompleteTypes,
  InputModeTypes,
  InputTypes,
} from "./Input.types";

export type InputProps = BaseFieldProps & {
  /**
   * Type of input
   *  */
  type?: InputTypes;

  /**
   * Placeholder text when the field value is empty
   */
  placeholder?: string;

  /**
   * The minimum allowed input length value of the field
   */
  minLength?: number;

  /**
   * The maximum allowed input length value of the field
   */
  maxLength?: number;

  /**
   * The minimum input value allowed
   */
  min?: number;

  /**
   * The maximum input value allowed
   */
  max?: number;

  /**
   * A regular expression pattern, such as [A-Z]+ for one or more uppercase characters
   */
  pattern?: string;

  /**
   * The Boolean multiple attribute, if set, means the user can enter comma separated
   * email addresses in the email widget or can choose more than one file with the file
   * input. See the email and file input type.
   */
  multiple?: boolean;

  /**
   * Global value valid for all elements, it provides a hint to browsers as to the type
   * of virtual keyboard configuration to use when editing this element or its contents.
   */
  inputMode?: InputModeTypes;

  /**
   * Use these attributes to control automatic correction and capitalization features
   * on some mobile devices (namely, the version of Safari that runs on iPads and iPhones)
   */
  autoCorrect?: boolean;

  /**
   * You can use autocomplete to recall recently typed values in a given input.
   * Besides sensitive data and one-time PINs, it's a time-saving feature.
   * You can turn on its value to recommend it for a particular input field or vice versa.
   */
  autoComplete?: boolean | InputAutoCompleteTypes;

  /**
   * You can set this attribute to true to indicate that the user should
   * check the spelling of some text, especially strings typed in an input.
   * The only issue that comes from this is that not all text that is typed
   * in the input is supposed to make sense as actual words.
   */
  spellCheck?: boolean;
};

/**
 * The base Input component used by the Open System repository
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      name,
      value,
      type = InputTypes.TEXT,
      disabled = false,
      required = false,
      noBorder = false,
      glow = true,
      label,
      placeholder,
      info,
      warning,
      errors,
      min,
      max,
      minLength,
      maxLength,
      pattern,
      tabIndex,
      multiple = false,
      inputMode,
      autoCorrect = false,
      autoComplete = InputAutoCompleteTypes.ON,
      autoFocus = false,
      spellCheck = false,
      onChange,
      onFocus,
      onBlur,
      ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [focused, setFocused] = useState<boolean>(false);
    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        event.stopPropagation();

        setFocused(true);
        onFocus?.();
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();

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
        disabled={disabled}
        required={required}
        noBorder={noBorder}>
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
              "ring-1 ring-active ring-offset-0": focused,
            },
            {
              "focus:shadow-active-glow": focused && glow,
            },
            "w-full rounded-xl font-label-1 leading-label-1 transition-colors focus:ring-0 focus:ring-active focus:ring-offset-0",
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
            className
          )}
          type={type === InputTypes.EMAIL ? InputTypes.TEXT : type}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={disabled}
          // required={required}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          // pattern={pattern}
          multiple={multiple}
          tabIndex={tabIndex}
          inputMode={
            inputMode
              ? inputMode
              : type === InputTypes.TEL
              ? InputModeTypes.TEL
              : type === InputTypes.URL
              ? InputModeTypes.URL
              : type === InputTypes.EMAIL
              ? InputModeTypes.EMAIL
              : type === InputTypes.NUMBER
              ? InputModeTypes.NUMERIC
              : type === InputTypes.SEARCH
              ? InputModeTypes.SEARCH
              : undefined
          }
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
          onBlur={handleBlur}></input>
      </FieldWrapper>
    );
  }
);
