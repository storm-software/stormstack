import { useFormContext, useFormState } from "react-hook-form";

export function useIsSubmitting() {
  const { control } = useFormContext();
  const { isSubmitting } = useFormState({ control });

  return isSubmitting;
}
