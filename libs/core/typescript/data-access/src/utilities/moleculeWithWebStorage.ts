import { molecule } from "jotai-molecules";
import { MoleculeGetter, ScopeGetter } from "jotai-molecules/dist/molecule";
import { MoleculeScope } from "jotai-molecules/dist/scope";
import { ScopedObjectState } from "../types";
import { atomWithWebStorage } from "./atomWithWebStorage";

export function moleculeWithWebStorage<
  TObject extends ScopedObjectState = ScopedObjectState,
  TScope = unknown
>(
  scope: MoleculeScope<TScope>,
  createMolecule: (
    scope: TScope,
    getMolecule: MoleculeGetter,
    getScope: ScopeGetter
  ) => TObject
) {
  return molecule((getMolecule, getScope) => {
    const id = getScope<TScope>(scope);

    return atomWithWebStorage(
      `${id?.toString()}`,
      createMolecule(id, getMolecule, getScope)
    );
  });
}
