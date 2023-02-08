import { useWatch } from "react-hook-form";

export function useFormValues() {
  return useWatch();
}
