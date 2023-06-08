/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSetToastError } from "@open-system/core-data-access";
import { getUniqueId, isFunction } from "@open-system/core-utilities";
import {
  BaseComponentProps,
  InputAutoCompleteTypes,
} from "@open-system/design-system-components";
import { useRouter } from "next/navigation";
import {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  FieldErrors,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { DeepPartial } from "../types";

export type AlertSubmitType = "none" | "toast" | "notification";
export const AlertSubmitType = {
  NONE: "none" as AlertSubmitType,
  TOAST: "toast" as AlertSubmitType,
  NOTIFICATION: "notification" as AlertSubmitType,
};

export type FormProps<
  TValues extends Record<string, any>,
  TContext = any
> = BaseComponentProps & {
  defaultValues?: DeepPartial<TValues>;
  values?: DeepPartial<TValues>;
  onSubmit: (values: TValues) => Promise<void> | void;
  context?: TContext;
  disabled?: boolean;
  name?: string;
  autoComplete?: boolean;
  resetOnSubmit?: boolean;
  alertSubmitFailureType?: AlertSubmitType;
  alertSubmitFailureMessage?: string | ((error?: any) => string);
  alertSubmitSuccessType?: AlertSubmitType;
  alertSubmitSuccessMessage?:
    | string
    | ((values: TValues, result?: any) => string);
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
  alertSubmitFailureType = AlertSubmitType.TOAST,
  alertSubmitFailureMessage,
  alertSubmitSuccessType = AlertSubmitType.NOTIFICATION,
  alertSubmitSuccessMessage = "Your input was successfully submitted.",
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
    setFormName(getUniqueId());
    trigger(undefined, { shouldFocus: false });
  }, [trigger]);

  const handleSubmit: SubmitHandler<TValues> = useCallback(
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

  const setToastError = useSetToastError();
  const handleSubmitError: SubmitErrorHandler<TValues> = useCallback(
    async (errors: FieldErrors<TValues>, event?: BaseSyntheticEvent) => {
      console.error("There was an error submitting.");
      console.error(errors, event);

      if (alertSubmitFailureType !== AlertSubmitType.NONE) {
        const message = isFunction(alertSubmitFailureMessage)
          ? alertSubmitFailureMessage(errors)
          : alertSubmitFailureMessage ?? "There was an error submitting.";
        if (alertSubmitFailureType === AlertSubmitType.TOAST) {
          setToastError(message);
        } else if (alertSubmitFailureType === AlertSubmitType.NOTIFICATION) {
          setToastError(message);
        }
      }
    },
    [alertSubmitFailureMessage, alertSubmitFailureType, setToastError]
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
          onSubmit={methods.handleSubmit(handleSubmit, handleSubmitError)}>
          <fieldset
            className={className}
            form={formName}
            disabled={formState?.isSubmitting || isPending || disabled}
            aria-disabled={formState?.isSubmitting || isPending || disabled}>
            {children}
          </fieldset>
        </form>
      </FormProvider>
      {/*<DevTool control={control} />*/}
    </>
  );
}
