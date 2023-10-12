"use client";

import {
  CheckboxProps,
  Checkbox as OsCheckbox
} from "@stormstack/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  useFieldErrors,
  useFieldRegistration,
  useFieldValue,
  useIsSubmitting
} from "../hooks";

export function Checkbox({
  name,
  required,
  disabled,
  ...props
}: CheckboxProps) {
  const { trigger } = useFormContext();

  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(() => {
    trigger(name, { shouldFocus: false });
    // return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger]);

  return (
    <OsCheckbox
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
