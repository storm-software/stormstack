import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { formFieldConfigFamily } from "../state/form";
import { FormFieldConfig } from "../types";
import { useFormId } from "./useFormId";

export const useFieldRegistration = (field: string) => {
  const { register } = useFormContext();

  const formId = useFormId();
  const setFormFieldConfig = useSetAtom(
    formFieldConfigFamily({ field, formId })
  );

  return useCallback(
    (config: Partial<FormFieldConfig>) => {
      const props = register(field, {
        shouldUnregister: false,
        ...config
      } as any);
      setFormFieldConfig(config);

      return { ...props, name: field, config };
    },
    [field, register, setFormFieldConfig]
  );
};
