"use client";

import {
  Rating as OsRating,
  RatingOption as OsRatingOption,
  RatingProps as OsRatingProps
} from "@stormstack/design-system-components";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  useFieldErrors,
  useFieldRegistration,
  useFieldValue,
  useIsSubmitting
} from "../hooks";

export type RatingProps = OsRatingProps & {
  /**
   * A list of options to display in the dropdown
   */
  max: number;
};

export function Rating({
  name,
  max,
  required,
  disabled,
  isVertical,
  ...props
}: RatingProps) {
  const { trigger } = useFormContext();
  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  const isSubmitting = useIsSubmitting();
  useEffect(() => {
    trigger();
    // return () => unregister(name, { keepIsValid: false });
  }, [name, trigger]);

  return (
    <OsRating
      {...props}
      name={name}
      value={value}
      isVertical={isVertical}
      errors={errors as Record<string, string>}>
      {Array.from({ length: max }).map((_: unknown, option: number) => {
        const optionValue = isVertical ? max - option : option - 1;
        return (
          <OsRatingOption
            key={optionValue}
            {...register({
              required: required ? "This field is required." : undefined,
              disabled: isSubmitting
            })}
            name={optionValue.toString()}
            value={optionValue}
          />
        );
      })}
    </OsRating>
  );
}
