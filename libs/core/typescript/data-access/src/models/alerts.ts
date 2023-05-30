/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrimitiveAtom, atom } from "jotai";
import { createScope } from "jotai-molecules";
import {
  Molecule,
  MoleculeGetter,
  ScopeGetter,
} from "jotai-molecules/dist/molecule";
import { moleculeWithWebStorage } from "../state/moleculeWithWebStorage";
import { MessageTypes, BaseMolecule } from "../types";

export interface Alert {
  type: MessageTypes;
  summary: string;
  details?: string;
  isExtendable: boolean;
}

export type AlertMolecule = BaseMolecule<Alert>;

export const AlertScope = createScope<string | undefined>(undefined);

export const AlertMolecule = moleculeWithWebStorage(
  AlertScope,
  (id: string | undefined, _: MoleculeGetter, __: ScopeGetter) => {
    const typeAtom = atom<MessageTypes>(MessageTypes.INFO);
    const summaryAtom = atom<string | undefined>(undefined);
    const detailsAtom = atom<string | undefined>(undefined);
    const isExtendableAtom = atom<boolean>(true);

    return {
      id,
      typeAtom,
      summaryAtom,
      detailsAtom,
      isExtendableAtom,
    };
  }
);

export const alertsAtom = atom<Record<string, Molecule<AlertMolecule>>>({});
