import { useFormContext } from "react-hook-form";

export function useFieldValue(name?: string | string[]) {
  const { getValues } = useFormContext();

  return getValues<any>(name);
}
