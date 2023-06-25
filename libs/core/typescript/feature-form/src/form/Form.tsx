/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormIdScope,
  NotificationMessage,
} from "@open-system/core-data-access";
import { ConsoleLogger, getField } from "@open-system/core-utilities";
import {
  BaseComponentProps,
  InputAutoCompleteTypes,
} from "@open-system/design-system-components";
import { ScopeProvider } from "jotai-molecules";
import {
  BaseSyntheticEvent,
  useEffect,
  experimental_useEffectEvent as useEffectEvent,
  useId,
  useState,
  useTransition,
} from "react";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { DeepPartial } from "../types";
// import { DevTool } from "@hookform/devtools";

export type AlertSubmitType = "none" | "toast" | "notification";
export const AlertSubmitType = {
  NONE: "none" as AlertSubmitType,
  TOAST: "toast" as AlertSubmitType,
  NOTIFICATION: "notification" as AlertSubmitType,
};

export type FormSubmitHandler<TValues extends Record<string, any>> = (payload: {
  data: TValues;
  event?: BaseSyntheticEvent;
  formData: FormData;
  formDataJson: string;
  method?: "post" | "put" | "delete";
}) => unknown | Promise<unknown>;

export type SubmitErrorHandler<TValues extends Record<string, any>> = (
  errors: FieldErrors<TValues>,
  event?: BaseSyntheticEvent
) => unknown | Promise<unknown>;

export type FormProps<
  TValues extends Record<string, any>,
  TContext = any
> = BaseComponentProps & {
  defaultValues?: DeepPartial<TValues>;
  initialValues?: DeepPartial<TValues>;
  context?: TContext;
  disabled?: boolean;
  name?: string;
  autoComplete?: boolean;
  resetOnSubmit?: boolean;
  headers?: Record<string, string>;
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain"
    | "application/json";
  method?: "post" | "put" | "delete";
  validateStatus?: (status: number) => boolean;
  action?: string | ((data: FormData) => void | Promise<void>);
  onSubmit?: FormSubmitHandler<TValues>;
  onError?: ({
    response,
    error,
  }:
    | {
        response: Response;
        error?: undefined;
      }
    | {
        response?: undefined;
        error: unknown;
      }) => void;
  onSuccess?: ({ response }: { response: Response }) => void;
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
  children,
  disabled = false,
  autoComplete = true,
  resetOnSubmit = true,
  onSubmit,
  action,
  method = "post",
  headers = {},
  encType,
  onError,
  onSuccess,
  validateStatus,
  alertSubmitFailureType = AlertSubmitType.TOAST,
  alertSubmitFailureMessage,
  alertSubmitSuccessType = AlertSubmitType.NONE,
  alertSubmitSuccessMessage = "Your input was successfully submitted.",
  ...props
}: FormProps<TValues>) {
  // const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

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
    progressive: true,
  });

  const [formId] = useState<string | undefined>(useId());

  const submit = useEffectEvent(async (event?: BaseSyntheticEvent) => {
    let hasError = false;
    let type = "";

    await control.handleSubmit(async data => {
      const formData = new FormData();
      let formDataJson = "";

      try {
        formDataJson = JSON.stringify(data);
      } catch {
        ConsoleLogger.error("Failed to stringify form data.");
      }

      for (const name of control._names.mount) {
        formData.append(name, getField(data, name));
      }

      if (onSubmit) {
        onSubmit({
          data,
          event,
          method,
          formData,
          formDataJson,
        });
      }

      if (action) {
        if (typeof action === "string") {
          try {
            const shouldStringifySubmissionData = [
              headers && headers["Content-Type"],
              encType,
            ].some(value => value && value.includes("json"));

            const response = await fetch(action, {
              method,
              headers: {
                ...headers,
                ...(encType ? { "Content-Type": encType } : {}),
              },
              body: shouldStringifySubmissionData ? formDataJson : formData,
            });

            if (
              response &&
              (validateStatus
                ? !validateStatus(response.status)
                : response.status < 200 || response.status >= 300)
            ) {
              hasError = true;
              onError && onError({ response });
              type = String(response.status);
            } else {
              onSuccess && onSuccess({ response });
            }
          } catch (error: unknown) {
            hasError = true;
            onError && onError({ error });
          }
        }
      }
    })(event);

    if (hasError && control) {
      control._subjects.state.next({
        isSubmitSuccessful: false,
      });
      control.setError("root.server", {
        type,
      });
    }
  });

  useEffect(() => {
    trigger(undefined, { shouldFocus: false });
    setMounted(true);
  }, [trigger]);

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
  }, [defaultValues]);

  const { add: addNotification } = useSetNotifications();
  const { add: addToast } = useSetToastMessages();*/
  /* const handleSubmit: SubmitHandler<TValues> = useCallback(
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
  );*/

  return (
    <ScopeProvider scope={FormIdScope} value={formId}>
      <FormProvider
        trigger={trigger}
        control={control}
        formState={formState}
        {...methods}>
        <form
          id={formId}
          name={formId}
          noValidate={mounted}
          action={action}
          method={method}
          encType={encType}
          onSubmit={submit}
          autoComplete={
            autoComplete
              ? InputAutoCompleteTypes.ON
              : InputAutoCompleteTypes.OFF
          }
          {...props}>
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
