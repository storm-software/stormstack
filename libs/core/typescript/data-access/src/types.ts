import { Getter, PrimitiveAtom, Setter } from "jotai";
import { RESET } from "jotai/utils";

export type Unsubscribe = () => void;

export type SetStateAction<TValue> = TValue | ((prev: TValue) => TValue);

export type SetStateActionWithReset<TValue> =
  | TValue
  | typeof RESET
  | ((prev: TValue) => TValue | typeof RESET);

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
