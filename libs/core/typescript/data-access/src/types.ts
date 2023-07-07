import { DeepPartial, ServerResult } from "@open-system/core-utilities";
import { BaseComponentProps } from "@open-system/design-system-components";
import { Getter, PrimitiveAtom, Setter } from "jotai";
import { RESET } from "jotai/utils";
import { FormHTMLAttributes } from "react";
import {
  Control,
  FormState,
  RegisterOptions,
  UseFormReturn,
} from "react-hook-form";
import {
  ConcreteRequest,
  GraphQLResponse,
  OperationType,
  VariablesOf,
} from "relay-runtime";

export type Unsubscribe = () => void;

export type SetStateAction<TValue> = TValue | ((prev: TValue) => TValue);

export type SetStateActionWithReset<TValue> =
  | TValue
  | typeof RESET
  | ((prev: TValue) => TValue | typeof RESET);

export type SplitAtomAction<TValue> =
  | {
      type: "remove";
      atom: PrimitiveAtom<TValue>;
    }
  | {
      type: "insert";
      value: TValue;
      before?: PrimitiveAtom<TValue>;
    }
  | {
      type: "move";
      atom: PrimitiveAtom<TValue>;
      before?: PrimitiveAtom<TValue>;
    };

export type Callback<TValue> = (
  get: Getter,
  set: Setter,
  newVal: TValue,
  prevVal: TValue
) => void;

export type ScopedObjectState = Record<string, any> & {
  id: string;
};

export type MoleculeObjectKeys<
  TObject extends ScopedObjectState = ScopedObjectState,
  MoleculeDataKey extends string & keyof Omit<TObject, "id"> = keyof Omit<
    TObject,
    "id"
  > &
    string
> = `${MoleculeDataKey}Atom`;

export type MoleculeObjectState<
  TObject extends ScopedObjectState = ScopedObjectState
> = {
  id: string;
} & {
  [Key in string & keyof MoleculeObjectKeys<TObject>]: PrimitiveAtom<
    TObject[Key]
  >;
};

export type MessageTypes = "warning" | "error" | "info" | "success";
export const MessageTypes = {
  WARNING: "warning" as MessageTypes,
  ERROR: "error" as MessageTypes,
  INFO: "info" as MessageTypes,
  SUCCESS: "success" as MessageTypes,
};

export const MAX_ATTACHMENT_SIZE = 50000000;

export const MAX_ATTACHMENTS_COUNT = 10;

export type WithFormFieldConfig<TConfig = any> = {
  type: string;
  field: string;
  formId: string;
} & TConfig;

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

export type InputFormFieldConfig = WithFormFieldConfig<{
  type: "input";
  valueType: string;
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

// https://nextjs.org/docs/advanced-features/security-headers
export const CONTENT_SECURITY_POLICY = `
      default-src 'self' vercel.live;
      script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live;
      style-src 'self' 'unsafe-inline';
      img-src * blob: data:;
      media-src 'none';
      connect-src *;
      font-src 'self';
  `;

export const SecurityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: CONTENT_SECURITY_POLICY.replace(/\n/g, ""),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

export type AlertSubmitType = "none" | "toast" | "notification";
export const AlertSubmitType = {
  NONE: "none" as AlertSubmitType,
  TOAST: "toast" as AlertSubmitType,
  NOTIFICATION: "notification" as AlertSubmitType,
};

export type FormSubmitHandlerParams<TValues extends Record<string, any>> = {
  data: TValues;
  formData: FormData;
  formDataJson: string;
};

export type FormSubmitHandler<
  TValues extends Record<string, any>,
  TData = Record<string, any>,
  TServerResult extends ServerResult<TData> = ServerResult<TData>
> = (payload: {
  data: TValues;
  formData: FormData;
  formDataJson: string;
}) => Promise<TServerResult>;

export type FormProps<TValues extends Record<string, any>> =
  BaseComponentProps &
    FormHTMLAttributes<HTMLFormElement> & {
      defaultValues?: DeepPartial<TValues>;
      initialValues?: DeepPartial<TValues>;
      disabled?: boolean;
      action?: (formData: FormData) => Promise<void>;
    };

export type FormTranslateTypes = "yes" | "no";
export const FormTranslateTypes = {
  YES: "yes" as FormTranslateTypes,
  NO: "no" as FormTranslateTypes,
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

export interface SerializablePreloadedQuery<
  TRequest extends ConcreteRequest,
  TQuery extends OperationType
> {
  params: TRequest["params"];
  variables: VariablesOf<TQuery>;
  response: GraphQLResponse;
}

export const CACHE_TTL = 5 * 1000; // 5 seconds, to resolve preloaded results
