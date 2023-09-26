/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormIdScope } from "@stormstack/core-client-data-access";
import { FormContext } from "@stormstack/core-shared-data-access";
import { BaseComponentProps } from "@stormstack/design-system-components";
import { ScopeProvider } from "jotai-molecules";
import { FormProvider as RHFormProvider } from "react-hook-form";
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
    <ScopeProvider scope={FormIdScope} value={formId}>
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
