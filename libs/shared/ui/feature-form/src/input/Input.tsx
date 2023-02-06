"use client";

import {
  Input as OsInput,
  InputProps as OsInputProps,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldErrors } from "../hooks/use-field-errors";
import { useFieldValue } from "../hooks/use-field-value";
import { useIsSubmitting } from "../hooks/use-is-submitting";
import { ValidationPropType } from "../types";

export type InputProps = Omit<
  OsInputProps,
  "pattern" | "min" | "max" | "minLength" | "maxLength"
> & {
  pattern?: ValidationPropType<RegExp>;
  min?: ValidationPropType<number>;
  max?: ValidationPropType<number>;
  minLength?: ValidationPropType<number>;
  maxLength?: ValidationPropType<number>;
};

export function Input({
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
  const { register, unregister } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  const field = register(name, {
    required: required ? "This field is required." : undefined,
    min,
    max,
    minLength,
    maxLength,
    pattern,
    disabled: useIsSubmitting() || disabled,
  });
  useEffect(
    () => () => unregister(name, { keepDefaultValue: true }),
    [name, unregister]
  );

  return (
    <OsInput
      {...props}
      {...field}
      value={value}
      errors={errors as Record<string, string>}
      min={field.min as number}
      max={field.max as number}
    />
  );
}
