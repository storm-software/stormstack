"use client";

import {
  Input as OsInput,
  InputProps as OsInputProps
} from "@stormstack/design-system-components";
import { useEffect } from "react";
import { UseFormRegisterReturn, useFormContext } from "react-hook-form";
import {
  useFieldErrors,
  useFieldRegistration,
  useFieldValue,
  useIsSubmitting
} from "../hooks";
import { ValidationPropType } from "../types";

export type InputProps = Omit<
  OsInputProps,
  "pattern" | "min" | "max" | "minLength" | "maxLength"
> & {
  pattern?: ValidationPropType<RegExp>;
  min?: ValidationPropType<number>;
  max?: ValidationPropType<number>;
  minLength?: ValidationPropType<number> | number;
  maxLength?: ValidationPropType<number> | number;
};

export function Input({
  label,
  name,
  required,
  min,
  max,
  minLength,
  maxLength,
  pattern,
  disabled,
  ...props
}: InputProps) {
  const { trigger } = useFormContext();
  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  const field = (register?.({
    required: required ? "This field is required." : undefined,
    min,
    max,
    minLength: minLength
      ? typeof minLength === "number"
        ? {
            value: minLength,
            message: `${
              label ? label : "Field"
            } must be longer than ${minLength} characters.`
          }
        : minLength
      : undefined,
    maxLength: maxLength
      ? typeof maxLength === "number"
        ? {
            value: maxLength,
            message: `${
              label ? label : "Field"
            } must be no more than ${maxLength} characters.`
          }
        : maxLength
      : undefined,
    pattern
  }) ?? {}) as UseFormRegisterReturn<string>;

  useEffect(() => {
    trigger(name, { shouldFocus: false });
    // return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger]);

  return (
    <OsInput
      {...props}
      {...field}
      label={label}
      value={value}
      errors={errors as Record<string, string>}
      min={field.min as number}
      max={field.max as number}
      disabled={useIsSubmitting() || disabled}
      required={required}
    />
  );
}
