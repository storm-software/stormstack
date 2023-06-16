"use client";

import {
  CheckboxProps,
  Checkbox as OsCheckbox,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldValue, useIsSubmitting, useFieldErrors, useFieldRegistration } from "@open-system/core-data-access";


export function Checkbox({
  name,
  required,
  disabled,
  ...props
}: CheckboxProps) {
  const { unregister, trigger } = useFormContext();

  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(() => {
    trigger();
    return () => unregister(name, { keepIsValid: false });
  }, [name, trigger, unregister]);

  return (
    <OsCheckbox
      {...props}
      {...register({
        required: required ? "This field is required." : undefined,
        disabled: useIsSubmitting() || disabled,
      })}
      value={value}
      errors={errors as Record<string, string>}
      required={required}
    />
  );
}
