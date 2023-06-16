import { Getter, PrimitiveAtom, Setter } from "jotai";
import { RESET } from "jotai/utils";
import { RegisterOptions } from "react-hook-form";

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
