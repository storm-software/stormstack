import { useWatch } from "react-hook-form";

export function useFieldValue(name: string) {
  return useWatch({ name });
}
