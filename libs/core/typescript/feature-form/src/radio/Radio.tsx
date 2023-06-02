"use client";

import {
  Radio as OsRadio,
  RadioOption as OsRadioOption,
  RadioProps as OsRadioProps,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldValue } from "../hooks/useFieldValue";
import { useIsSubmitting } from "../hooks/useIsSubmitting";
import { useFieldErrors } from "../hooks/useFieldErrors";
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
  const { register, unregister, trigger } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  const isSubmitting = useIsSubmitting();
  useEffect(() => {
    trigger();
    return () => unregister(name, { keepIsValid: false });
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
          {...register(name, {
            required: required ? "This field is required." : undefined,
            disabled: isSubmitting || option.disabled,
          })}
          name={option.name}
        />
      ))}
    </OsRadio>
  );
}
