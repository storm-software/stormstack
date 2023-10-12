import { ScopedObjectState } from "@stormstack/core-client-state";
import { FileUploadState } from "@stormstack/core-shared-state";
import { DeepPartial, StormError } from "@stormstack/core-shared-utilities";
import { BaseComponentProps } from "@stormstack/design-system-components";
import { FormHTMLAttributes } from "react";
import {
  Control,
  FormState,
  RegisterOptions,
  UseFormReturn
} from "react-hook-form";

export type ValidationPropType<TValue> = {
  value: TValue;
  message: string;
};

export type InputFormFieldConfig = WithFormFieldConfig<{
  type: "input";
  valueType: string;
}>;

export type FormSubmitHandlerParams<TValues extends Record<string, any>> = {
  data: TValues;
  formData: FormData;
  formDataJson: string;
};

export type WithFormFieldConfig<TConfig = any> = {
  type: string;
  field: string;
  formId: string;
} & TConfig;

export type FormSubmitHandler<
  TValues extends Record<string, any>,
  TData = any
> = (payload: {
  data: TValues;
  formData: FormData;
  formDataJson: string;
}) => Promise<StormError | TData>;

export type FileUploadFieldState = FileUploadState & ScopedObjectState;

export type FileFormFieldConfig = WithFormFieldConfig<{
  type: "file";
  multiple: boolean;
  minFiles: number;
  maxFiles: number;
  minSizeInBytes: number;
  maxSizeInBytes: number;
  allowedFiles: string[];
  validator?: (file: File) => string[];
}>;

export type FormFieldConfig = Omit<
  RegisterOptions<any, string>,
  "pattern" | "valueAsNumber" | "valueAsDate"
> &
  (FileFormFieldConfig | InputFormFieldConfig) & {
    pattern?: any;
    valueAsNumber?: boolean;
    valueAsDate?: boolean;
  };

export type FormTranslateTypes = "yes" | "no";
export const FormTranslateTypes = {
  YES: "yes" as FormTranslateTypes,
  NO: "no" as FormTranslateTypes
};

export type FormProps<TValues extends Record<string, any>> =
  BaseComponentProps &
    FormHTMLAttributes<HTMLFormElement> & {
      defaultValues?: DeepPartial<TValues>;
      initialValues?: DeepPartial<TValues>;
      disabled?: boolean;
      action?: (formData: FormData) => Promise<void>;
    };

export type FormContext<
  TValues extends Record<string, any> = Record<string, any>
> = {
  formId: string;
  control: Control<TValues, any>;
  props: FormProps<TValues>;
  state: FormState<TValues>;
  methods: Pick<
    UseFormReturn<TValues>,
    | "watch"
    | "getValues"
    | "getFieldState"
    | "setError"
    | "clearErrors"
    | "setValue"
    | "trigger"
    | "resetField"
    | "reset"
    | "unregister"
    | "register"
    | "setFocus"
    | "handleSubmit"
  >;
};
