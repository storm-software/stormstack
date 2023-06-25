"use client";

import { useFormContext, useFormState } from "react-hook-form";

export function useIsSubmitting() {
   const { control } = useFormContext();
   const { isSubmitting } = useFormState({ control });
  //const status = useFormStatus();
  //return !!status?.pending;

  return isSubmitting;
}
