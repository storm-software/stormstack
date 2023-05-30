"use client";

import {
  Select as OsSelect,
  SelectProps,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldValue } from "../hooks/use-field-value";
import { useIsSubmitting } from "../hooks/use-is-submitting";
import { useFieldErrors } from "../hooks/useFieldErrors";

export function Select({ name, required, disabled, ...props }: SelectProps) {
  const { register, unregister, trigger } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(() => {
    trigger();
    return () => unregister(name, { keepIsValid: false });
  }, [name, trigger, unregister]);

  return (
    <OsSelect
      {...props}
      {...register(name, {
        required: required ? "This field is required." : undefined,
        disabled: useIsSubmitting() || disabled,
      })}
      value={value}
      errors={errors as Record<string, string>}
    />
  );
}
