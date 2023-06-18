"use client";

import {
  Select as OsSelect,
  SelectProps,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldErrors, useFieldValue, useIsSubmitting, useFieldRegistration } from "@open-system/core-data-access";

export function Select({ name, required, disabled, ...props }: SelectProps) {
  const { unregister, trigger } = useFormContext();
  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(() => {
    trigger(name, { shouldFocus: false });
    return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger, unregister]);

  return (
    <OsSelect
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
