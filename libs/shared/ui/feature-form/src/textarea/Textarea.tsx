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
  minLength?: ValidationPropType<number> | number;
  maxLength?: ValidationPropType<number> | number;
};

export function Textarea({
  label,
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
        disabled: useIsSubmitting() || disabled,
      })}
      label={label}
      value={value}
      errors={errors as Record<string, string>}
    />
  );
}
