"use client";

import {
  Input as OsInput,
  InputProps as OsInputProps,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { UseFormRegisterReturn, useFormContext } from "react-hook-form";
import { useFieldErrors } from "../hooks/useFieldErrors";
import { useFieldValue } from "../hooks/useFieldValue";
import { useIsSubmitting } from "../hooks/useIsSubmitting";
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
  const { register, unregister, trigger } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  const field = (register?.(name, {
    required: required ? "This field is required." : undefined,
    min,
    max,
    minLength: minLength
      ? typeof minLength === "number"
        ? {
            value: minLength,
            message: `${
              label ? label : "Field"
            } must be longer than ${minLength} characters.`,
          }
        : minLength
      : undefined,
    maxLength: maxLength
      ? typeof maxLength === "number"
        ? {
            value: maxLength,
            message: `${
              label ? label : "Field"
            } must be no more than ${maxLength} characters.`,
          }
        : maxLength
      : undefined,
    pattern,
  }) ?? {}) as UseFormRegisterReturn<string>;

  useEffect(() => {
    trigger();
    return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger, unregister]);

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
    />
  );
}
