"use client";

import {
  Radio as OsRadio,
  RadioOption as OsRadioOption,
  RadioProps as OsRadioProps,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldErrors, useFieldValue, useIsSubmitting, useFieldRegistration } from "@open-system/core-data-access";
import { RadioOption } from "./Radio.types";

export type RadioProps = OsRadioProps & {
  /**
   * A list of options to display in the dropdown
   */
  options?: RadioOption[];
};

export function Radio({
  name,
  required,
  disabled,
  options = [],
  ...props
}: RadioProps) {
  const { unregister, trigger } = useFormContext();
  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  const isSubmitting = useIsSubmitting();
  useEffect(() => {
    trigger(name, { shouldFocus: false });
    return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger, unregister]);

  return (
    <OsRadio
      {...props}
      name={name}
      value={value}
      errors={errors as Record<string, string>}>
      {options.map((option: RadioOption) => (
        <OsRadioOption
          key={option.value}
          {...option}
          {...register({
            required: required ? "This field is required." : undefined,
            disabled: isSubmitting || option.disabled,
          })}
          name={option.name}
          required={required}
        />
      ))}
    </OsRadio>
  );
}
