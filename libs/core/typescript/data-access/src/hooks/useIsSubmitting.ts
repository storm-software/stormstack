"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";

export function useIsSubmitting() {
  // const { control } = useFormContext();
  // const { isSubmitting } = useFormState({ control });
  const status = useFormStatus();

  return !!status?.pending;
}
