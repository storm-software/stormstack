import { molecule } from "jotai-molecules";
import { MoleculeGetter, ScopeGetter } from "jotai-molecules/dist/molecule";
import { MoleculeScope } from "jotai-molecules/dist/scope";
import { atomWithWebStorage } from "./atomWithWebStorage";

export function moleculeWithWebStorage<TValue = unknown, TScope = unknown>(
  scope: MoleculeScope<TScope>,
  createMolecule: (
    scope: TScope,
    getMolecule: MoleculeGetter,
    getScope: ScopeGetter
  ) => TValue
) {
  return molecule((_getMolecule, _getScope) => {
    const id = _getScope<TScope>(scope);

    return atomWithWebStorage(
      `${id?.toString()}`,
      createMolecule(id, _getMolecule, _getScope)
    );
  });
}
