import { Getter, PrimitiveAtom, Setter } from "jotai";
import { RESET } from "jotai/utils";

export type Unsubscribe = () => void;
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

export type MessageTypes = "warning" | "error" | "info" | "success";
export const MessageTypes = {
  WARNING: "warning" as MessageTypes,
  ERROR: "error" as MessageTypes,
  INFO: "info" as MessageTypes,
  SUCCESS: "success" as MessageTypes,
};

export interface LinkDetails {
  href: string;
  text: string;
}

export interface Notification {
  type: MessageTypes;
  message: string;
  link?: LinkDetails;
}

export type MoleculeKeys<
  TObject = Record<string, any>,
  MoleculeKey extends string & keyof TObject = keyof TObject & string
> = `${MoleculeKey}Atom`;

export type BaseMolecule<TObject = Record<string, any>> = {
  id: string;
} & {
  [Key in string & keyof MoleculeKeys<TObject>]: PrimitiveAtom<any>;
};
