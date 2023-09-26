import { ScopedObjectState } from "@stormstack/core-shared-data-access";
import { PrimitiveAtom } from "jotai";
import { RESET } from "jotai/utils";
import { GraphQLResponse, OperationType, VariablesOf } from "relay-runtime";
import { ConcreteRequest } from "relay-runtime/lib/util/RelayConcreteNode";

export interface SerializablePreloadedQuery<
  TRequest extends ConcreteRequest,
  TQuery extends OperationType
> {
  params: TRequest["params"];
  variables: VariablesOf<TQuery>;
  response: GraphQLResponse;
}

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
  SUCCESS: "success" as MessageTypes
};

export type AlertSubmitType = "none" | "toast" | "notification";
export const AlertSubmitType = {
  NONE: "none" as AlertSubmitType,
  TOAST: "toast" as AlertSubmitType,
  NOTIFICATION: "notification" as AlertSubmitType
};
