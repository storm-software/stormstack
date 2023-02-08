import { useFormContext, useFormState } from "react-hook-form";

export function useIsValid() {
  const { control } = useFormContext();
  const { isValid } = useFormState({ control });

  return isValid;
}
