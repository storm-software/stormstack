/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmptyObject } from "@open-system/core-utilities";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
  useFormState,
} from "react-hook-form";

export function useIsValid(excludeRequired = true) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { isValid } = useFormState({ control });

  if (
    !isValid &&
    excludeRequired &&
    !isEmptyObject(errors) &&
    Object.entries(errors).every(
      ([_, error]: [
        any,
        (
          | FieldError
          | Merge<FieldError, FieldErrorsImpl<any>>
          | (Record<
              string,
              Partial<{ type: string | number; message: string }>
            > &
              Partial<{ type: string | number; message: string }>)
          | undefined
        )
      ]) => !!(error?.type === "required")
    )
  ) {
    return true;
  }

  return isValid;
}
