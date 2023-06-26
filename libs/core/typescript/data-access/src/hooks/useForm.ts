/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ConsoleLogger,
  ServerFieldError,
  ServerResult,
  isEmptyObject,
  isObject,
  validateServerResult,
} from "@open-system/core-utilities";
import {
  BaseComponentProps,
  InputAutoCompleteTypes,
} from "@open-system/design-system-components";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { DeepPartial, Path, useForm as useRHForm } from "react-hook-form";
import {
  FormContext,
  FormSubmitHandlerParams,
  FormTranslateTypes,
} from "../types";
// import { DevTool } from "@hookform/devtools";

export type UseFormParams<
  TValues extends Record<string, any>,
  TData = Record<string, any>,
  TServerResult extends ServerResult<TData> = ServerResult<TData>
> = Omit<BaseComponentProps, "translate"> & {
  defaultValues?: DeepPartial<TValues>;
  initialValues?: DeepPartial<TValues>;
  disabled?: boolean;
  autoComplete?: boolean;
  translate?: boolean;
  resetOnSubmit?: boolean;
  onError?: (values: TValues, result: TServerResult | Error) => void;
  onSuccess?: (values: TValues, result: TServerResult) => void;
  onSettled?: (values: TValues) => void;
};

export type UseFormResult<
  TValues extends Record<string, any>,
  TData = Record<string, any>,
  TServerResult extends ServerResult<TData> = ServerResult<TData>
> = {
  withSubmit: (
    action: (params: FormSubmitHandlerParams<TValues>) => Promise<TServerResult>
  ) => (formData: FormData) => Promise<void>;
  context: FormContext<TValues>;
};

export const useForm = <
  TValues extends Record<string, any>,
  TData = Record<string, any>,
  TServerResult extends ServerResult<TData> = ServerResult<TData>
>({
  defaultValues,
  initialValues,
  disabled = false,
  autoComplete = true,
  resetOnSubmit = true,
  translate = true,
  onError,
  onSuccess,
  onSettled,
  ...props
}: UseFormParams<TValues, TData, TServerResult>): UseFormResult<
  TValues,
  TData,
  TServerResult
> => {
  // const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  const { trigger, control, formState, ...methods } = useRHForm<TValues>({
    mode: "all",
    criteriaMode: "all",
    reValidateMode: "onChange",
    defaultValues: defaultValues as any,
    values: initialValues as any,
    shouldFocusError: false,
    shouldUnregister: false,
    shouldUseNativeValidation: true,
    progressive: false,
  });

  const formId = useRef(useId());
  const [formProps, setFormProps] = useState({
    id: formId.current,
    name: formId.current,
    noValidate: mounted,
    disabled: disabled || isPending,
    autoComplete: autoComplete
      ? InputAutoCompleteTypes.ON
      : InputAutoCompleteTypes.OFF,
    translate: translate ? FormTranslateTypes.YES : FormTranslateTypes.NO,
    ...props,
  });

  const withSubmit = useCallback(
    (
        action: (
          params: FormSubmitHandlerParams<TValues>
        ) => Promise<TServerResult>
      ) =>
      async (formData: FormData) => {
        await control.handleSubmit(async (data: TValues) => {
          let formDataJson = "";

          try {
            formDataJson = JSON.stringify(formData);
          } catch {
            ConsoleLogger.error("Failed to stringify form data.");
          }

          startTransition(() => {
            action({
              data,
              formData,
              formDataJson,
            })
              .then((result: TServerResult) => {
                if (!validateServerResult(result)) {
                  !isEmptyObject(result.fields) &&
                    isObject(result.fields) &&
                    Object.entries<ServerFieldError>(result.fields).forEach(
                      ([key, field]: [string, ServerFieldError]) => {
                        control.setError(key as Path<TValues>, {
                          type: field.code,
                        });
                      }
                    );

                  onError && onError(data, result);
                } else {
                  onSuccess && onSuccess(data, result);
                }
              })
              .catch((error: unknown) => {
                control.setError("root.server", {
                  type: "500",
                });

                onError && onError(data, error as Error);
              })
              .finally(() => {
                control._subjects.state.next({
                  isSubmitSuccessful: false,
                });

                onSettled && onSettled(data);
              });
          });
        })();
      },
    [control, onError, onSettled, onSuccess]
  );

  useEffect(() => {
    trigger(undefined, { shouldFocus: false });
    setMounted(true);
  }, [trigger]);

  return {
    withSubmit,
    context: {
      formId: formId.current,
      control,
      props: formProps,
      state: formState,
      methods: { ...methods, trigger },
    },
  };
};
