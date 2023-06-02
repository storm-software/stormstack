/* eslint-disable @typescript-eslint/no-unused-vars */
import { getGuid } from "@open-system/core-utilities";
import { atom } from "jotai";
import { createScope } from "jotai-molecules";
import {
  Molecule,
  MoleculeGetter,
  ScopeGetter,
} from "jotai-molecules/dist/molecule";
import { MessageTypes, MoleculeObjectKeys, ScopedObjectState } from "../types";
import { moleculeWithWebStorage } from "../utilities/moleculeWithWebStorage";

export interface Alert extends ScopedObjectState {
  type: MessageTypes;
  summary: string;
  details?: string;
  isExtendable: boolean;
}

export type AlertMolecule = MoleculeObjectKeys<Alert>;

export const AlertScope = createScope<string>(getGuid());

export const AlertMolecule = moleculeWithWebStorage(
  AlertScope,
  (
    id: string,
    getMolecule: MoleculeGetter,
    getScope: ScopeGetter
  ): ScopedObjectState => {
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
