"use client";

import {
  Textarea as OsTextarea,
  TextareaProps as OsTextareaProps,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldErrors } from "../hooks/use-field-errors";
import { useFieldValue } from "../hooks/use-field-value";
import { useIsSubmitting } from "../hooks/use-is-submitting";
import { ValidationPropType } from "../types";

export type TextareaProps = Omit<OsTextareaProps, "minLength" | "maxLength"> & {
  minLength?: ValidationPropType<number>;
  maxLength?: ValidationPropType<number>;
};

export function Textarea({
  name,
  required,
  minLength,
  maxLength,
  disabled,
  ...props
}: TextareaProps) {
  const { register, unregister } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(
    () => () => unregister(name, { keepDefaultValue: true }),
    [name, unregister]
  );

  return (
    <OsTextarea
      {...props}
      {...register(name, {
        required: required ? "This field is required." : undefined,
        minLength,
        maxLength,
        disabled: useIsSubmitting() || disabled,
      })}
      value={value}
      errors={errors as Record<string, string>}
    />
  );
}
