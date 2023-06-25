import ReactDOM from "react-dom";

export function useIsSubmitting() {
  // const { control } = useFormContext();
  // const { isSubmitting } = useFormState({ control });
  const status = ReactDOM.experimental_useFormStatus();

  return !!status?.pending;
}
