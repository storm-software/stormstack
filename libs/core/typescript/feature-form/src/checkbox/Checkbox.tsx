"use client";

import {
  CheckboxProps,
  Checkbox as OsCheckbox,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldValue } from "../hooks/useFieldValue";
import { useIsSubmitting } from "../hooks/useIsSubmitting";
import { useFieldErrors } from "../hooks/useFieldErrors";

export function Checkbox({
  name,
  required,
  disabled,
  ...props
}: CheckboxProps) {
  const { register, unregister, trigger } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(() => {
    trigger();
    return () => unregister(name, { keepIsValid: false });
  }, [name, trigger, unregister]);

  return (
    <OsCheckbox
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
