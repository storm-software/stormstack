import { Getter, Setter, atom } from "jotai";
import { useMolecule } from "jotai-molecules";
import { Molecule, MoleculeGetter, ScopeGetter } from "jotai-molecules/dist/molecule";

export const useCurrentUser = (): User => {
  return useMolecule(UserMolecule);
};
