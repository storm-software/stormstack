/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormIdScope,
  MessageTypes,
  NotificationMessage,
  useSetNotifications,
  useSetToastMessages,
} from "@open-system/core-data-access";
import { getUniqueId, isFunction } from "@open-system/core-utilities";
import {
  BaseComponentProps,
  InputAutoCompleteTypes,
} from "@open-system/design-system-components";
import { ScopeProvider } from "jotai-molecules";
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
// import { DevTool } from "@hookform/devtools";

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
  initialValues?: DeepPartial<TValues>;
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
    | ((values: TValues, result?: any) => string)
    | (
        | Partial<Pick<NotificationMessage, "id" | "type">>
        | Omit<NotificationMessage, "id" | "type">
      );
};

export function Form<TValues extends Record<string, any>, TContext = any>({
  className,
  name,
  defaultValues,
  initialValues,
  context,
  onSubmit,
  children,
  disabled = false,
  autoComplete = true,
  resetOnSubmit = true,
  alertSubmitFailureType = AlertSubmitType.TOAST,
  alertSubmitFailureMessage,
  alertSubmitSuccessType = AlertSubmitType.NONE,
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
    values: initialValues as any,
    shouldFocusError: false,
    shouldUnregister: false,
    shouldUseNativeValidation: true,
  });

  /*useEffect(() => {
    methods.reset(defaultValues as TValues, {
      keepDirtyValues: true,
      keepErrors: true,
      keepDirty: true,
      keepValues: true,
      keepDefaultValues: true,
      keepIsSubmitted: true,
      keepTouched: true,
      keepIsValid: true,
      keepSubmitCount: true,
    });
    trigger(undefined, { shouldFocus: false });
  }, [defaultValues]);*/

  const [formId, setFormId] = useState<string | undefined>(name);
  useEffect(() => {
    setFormId(getUniqueId());
    trigger(undefined, { shouldFocus: false });
  }, [trigger]);

  const { add: addNotification } = useSetNotifications();
  const { add: addToast } = useSetToastMessages();
  const handleSubmit: SubmitHandler<TValues> = useCallback(
    async (formValues: TValues) => {
      let result!: any;
      try {
        result = await Promise.resolve(onSubmit?.(formValues));
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

      if (alertSubmitSuccessType !== AlertSubmitType.NONE) {
        const message = isFunction(alertSubmitSuccessMessage)
          ? alertSubmitSuccessMessage(formValues)
          : alertSubmitSuccessMessage ?? "There was an error submitting.";
        if (alertSubmitSuccessType === AlertSubmitType.TOAST) {
          addToast({ message, type: MessageTypes.SUCCESS });
        } else if (alertSubmitSuccessType === AlertSubmitType.NOTIFICATION) {
          addNotification(
            typeof message === "string"
              ? { message, type: MessageTypes.SUCCESS }
              : {
                  type: MessageTypes.SUCCESS,
                  ...(message as
                    | Partial<Pick<NotificationMessage, "id" | "type">>
                    | Omit<NotificationMessage, "id" | "type">),
                }
          );
        }
      }

      return result;
    },
    [
      addNotification,
      addToast,
      alertSubmitSuccessMessage,
      alertSubmitSuccessType,
      methods,
      onSubmit,
      resetOnSubmit,
      router,
    ]
  );

  const handleSubmitError: SubmitErrorHandler<TValues> = useCallback(
    async (errors: FieldErrors<TValues>, event?: BaseSyntheticEvent) => {
      console.error("There was an error submitting.");
      console.error(errors, event);

      if (alertSubmitFailureType !== AlertSubmitType.NONE) {
        const message = isFunction(alertSubmitFailureMessage)
          ? alertSubmitFailureMessage(errors)
          : alertSubmitFailureMessage ?? "There was an error submitting.";
        if (alertSubmitFailureType === AlertSubmitType.TOAST) {
          addToast({ message, type: MessageTypes.ERROR });
        } else if (alertSubmitFailureType === AlertSubmitType.NOTIFICATION) {
          addNotification({ message, type: MessageTypes.ERROR });
        }
      }
    },
    [
      addNotification,
      addToast,
      alertSubmitFailureMessage,
      alertSubmitFailureType,
    ]
  );

  return (
    <ScopeProvider scope={FormIdScope} value={formId}>
      <FormProvider
        trigger={trigger}
        control={control}
        formState={formState}
        {...methods}>
        <form
          name={formId}
          autoComplete={
            autoComplete
              ? InputAutoCompleteTypes.ON
              : InputAutoCompleteTypes.OFF
          }
          onSubmit={methods.handleSubmit(handleSubmit, handleSubmitError)}>
          <fieldset
            className={className}
            form={formId}
            disabled={formState?.isSubmitting || isPending || disabled}
            aria-disabled={formState?.isSubmitting || isPending || disabled}>
            {children}
          </fieldset>
        </form>
      </FormProvider>
      {/*<DevTool control={control} />*/}
    </ScopeProvider>
  );
}
