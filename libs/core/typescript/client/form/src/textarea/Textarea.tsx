"use client";

import {
  Textarea as OsTextarea,
  TextareaProps as OsTextareaProps
} from "@stormstack/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  useFieldErrors,
  useFieldRegistration,
  useFieldValue,
  useIsSubmitting
} from "../hooks";
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
  const { trigger } = useFormContext();
  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(() => {
    trigger(name, { shouldFocus: false });
    // return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger]);

  return (
    <OsTextarea
      {...props}
      {...register({
        required: required ? "This field is required." : undefined,
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
        disabled: useIsSubmitting() || disabled
      })}
      label={label}
      required={required}
      value={value}
      errors={errors as Record<string, string>}
    />
  );
}
