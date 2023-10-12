"use client";

import {
  Select as OsSelect,
  SelectProps
} from "@stormstack/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  useFieldErrors,
  useFieldRegistration,
  useFieldValue,
  useIsSubmitting
} from "../hooks";

export function Select({ name, required, disabled, ...props }: SelectProps) {
  const { trigger } = useFormContext();
  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(() => {
    trigger(name, { shouldFocus: false });
    // return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger]);

  return (
    <OsSelect
      {...props}
      {...register({
        required: required ? "This field is required." : undefined,
        disabled: useIsSubmitting() || disabled
      })}
      value={value}
      errors={errors as Record<string, string>}
      required={required}
    />
  );
}
