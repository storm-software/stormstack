"use client";

import {
  Radio as OsRadio,
  RadioProps,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldErrors } from "../hooks/use-field-errors";
import { useFieldValue } from "../hooks/use-field-value";
import { useIsSubmitting } from "../hooks/use-is-submitting";

export function Radio({ name, required, disabled, ...props }: RadioProps) {
  const { register, unregister } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useEffect(
    () => () => unregister(name, { keepDefaultValue: true }),
    [name, unregister]
  );

  return (
    <OsRadio
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
