/* eslint-disable @typescript-eslint/no-explicit-any */
import { Path, useWatch } from "react-hook-form";

export function useFormValues<
  TValues extends Record<string, any> = Record<string, any>
>(names?: readonly Path<TValues>[]): Partial<TValues> {
  return useWatch<TValues>(
    names ? { name: names } : (undefined as any)
  ) as Partial<TValues>;
}
