"use client";

import { getGuid } from "@open-system/core-typescript-utilities";
import {
  BaseComponentProps,
  InputAutoCompleteTypes,
} from "@open-system/design-system-components";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DeepPartial } from "../types";

export type FormProps<
  TValues extends Record<string, any>,
  TContext = any
> = BaseComponentProps & {
  defaultValues?: DeepPartial<TValues>;
  onSubmit: (values: TValues) => Promise<void>;
  context?: TContext;
  disabled?: boolean;
  name?: string;
  autoComplete?: boolean;
};

export function Form<TValues extends Record<string, any>, TContext = any>({
  name,
  defaultValues,
  context,
  onSubmit,
  children,
  disabled = false,
  autoComplete = true,
  ...props
}: FormProps<TValues>) {
  const { trigger, ...methods } = useForm<TValues, TContext>({
    mode: "all",
    criteriaMode: "all",
    reValidateMode: "onChange",
    context,
    defaultValues: defaultValues as any,
    shouldFocusError: false,
    shouldUnregister: false,
    shouldUseNativeValidation: true,
  });

  const [formName, setFormName] = useState<string | undefined>(name);
  useEffect(() => {
    setFormName(getGuid());
    trigger(undefined, { shouldFocus: false });
  }, [trigger]);

  return (
    <FormProvider trigger={trigger} {...methods}>
      <form
        name={formName}
        autoComplete={
          autoComplete ? InputAutoCompleteTypes.ON : InputAutoCompleteTypes.OFF
        }
        onSubmit={methods.handleSubmit(onSubmit)}>
        <fieldset form={formName} disabled={disabled} aria-disabled={disabled}>
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
}
