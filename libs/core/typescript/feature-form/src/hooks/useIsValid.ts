import { useFormContext, useFormState } from "react-hook-form";
import { useFieldErrors } from "./useFieldErrors";

export function useIsValid(excludeRequired = true) {
  const { control, formState: { errors } } = useFormContext();
  const { isValid } = useFormState({ control });

  if (!isValid &&
    excludeRequired &&
    !isEmptyObject(errors) &&
    Object.entries(errors).some(
      ([type, message]) => type === "required"
    )
  ) {
    return false;
  }

  return isValid;
}
