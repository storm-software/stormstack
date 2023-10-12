/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ScopeProvider } from "@stormstack/core-client-state";
import { BaseComponentProps } from "@stormstack/design-system-components";
import { FormProvider as RHFormProvider } from "react-hook-form";
import { formIdAtom } from "../state";
import { FormContext } from "../types";
// import { DevTool } from "@hookform/devtools";

export type FormProviderProps<TValues extends Record<string, any>> =
  FormContext<TValues> & BaseComponentProps;

export function FormProvider<TValues extends Record<string, any>>({
  className,
  formId,
  children,
  control,
  state,
  methods,
  ...rest
}: FormProviderProps<TValues>) {
  return (
    <ScopeProvider atoms={[formIdAtom]}>
      <RHFormProvider<TValues>
        control={control}
        formState={state}
        {...methods}
        {...rest}>
        <fieldset
          className={className}
          form={formId}
          disabled={state?.isSubmitting || rest.props?.disabled}
          aria-disabled={state?.isSubmitting || rest.props?.disabled}>
          {children}
        </fieldset>
      </RHFormProvider>
      {/*<DevTool control={control} />*/}
    </ScopeProvider>
  );
}
