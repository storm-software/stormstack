"use client";

//import { experimental_useFormStatus as useFormStatus } from "react-dom";
//import {} from 'react-dom/experimental';
import { useFormContext, useFormState } from 'react-hook-form';

export function useIsSubmitting() {
  const { control } = useFormContext();
  const { isSubmitting } = useFormState({ control });
  //const status = useFormStatus();

  //return !!status?.pending;
  return isSubmitting;
}
