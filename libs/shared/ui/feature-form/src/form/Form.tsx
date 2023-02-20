/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getGuid } from "@open-system/core-typescript-utilities";
import {
  BaseComponentProps,
  InputAutoCompleteTypes,
} from "@open-system/design-system-components";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DeepPartial } from "../types";

export type FormProps<
  TValues extends Record<string, any>,
  TContext = any
> = BaseComponentProps & {
  defaultValues?: DeepPartial<TValues>;
  onSubmit: (values: TValues) => Promise<void> | void;
  context?: TContext;
  disabled?: boolean;
  name?: string;
  autoComplete?: boolean;
  resetOnSubmit?: boolean;
};

export function Form<TValues extends Record<string, any>, TContext = any>({
  className,
  name,
  defaultValues,
  context,
  onSubmit,
  children,
  disabled = false,
  autoComplete = true,
  resetOnSubmit = true,
  ...props
}: FormProps<TValues>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { trigger, control, formState, ...methods } = useForm<
    TValues,
    TContext
  >({
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

  const handleSubmit = useCallback(
    async (values: TValues) => {
      let result!: any;
      try {
        result = await Promise.resolve(onSubmit?.(values));
      } catch (e) {
        methods.reset(undefined, {
          keepDirtyValues: true,
          keepErrors: true,
          keepDirty: true,
          keepValues: true,
          keepDefaultValues: true,
          keepIsSubmitted: false,
          keepTouched: true,
          keepIsValid: true,
          keepSubmitCount: true,
        });

        throw e;
      }

      startTransition(() => {
        resetOnSubmit &&
          methods.reset(undefined, {
            keepDirtyValues: false,
            keepErrors: false,
            keepDirty: false,
            keepValues: false,
            keepDefaultValues: true,
            keepIsSubmitted: false,
            keepTouched: false,
            keepIsValid: false,
            keepSubmitCount: false,
          });

        router.refresh();
      });

      return result;
    },
    [methods, onSubmit, resetOnSubmit, router]
  );

  return (
    <>
      <FormProvider
        trigger={trigger}
        control={control}
        formState={formState}
        {...methods}>
        <form
          name={formName}
          autoComplete={
            autoComplete
              ? InputAutoCompleteTypes.ON
              : InputAutoCompleteTypes.OFF
          }
          onSubmit={methods.handleSubmit(handleSubmit)}>
          <fieldset
            className={className}
            form={formName}
            disabled={formState?.isSubmitting || disabled}
            aria-disabled={formState?.isSubmitting || disabled}>
            {children}
          </fieldset>
        </form>
      </FormProvider>
      {/*<DevTool control={control} />*/}
    </>
  );
}
