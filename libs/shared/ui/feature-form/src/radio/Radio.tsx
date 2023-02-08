"use client";

import {
  Radio as OsRadio,
  RadioOption as OsRadioOption,
  RadioProps as OsRadioProps,
} from "@open-system/design-system-components";
import { useFormContext } from "react-hook-form";
import { useFieldErrors } from "../hooks/use-field-errors";
import { useFieldValue } from "../hooks/use-field-value";
import { useIsSubmitting } from "../hooks/use-is-submitting";
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
  const { register } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  const isSubmitting = useIsSubmitting();

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
