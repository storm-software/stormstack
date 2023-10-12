/*import { ScopedObjectState } from "@stormstack/core-shared-data-access";
import { atomWithWebStorage } from "./atomWithWebStorage";

export function moleculeWithWebStorage<
  TObject extends ScopedObjectState = ScopedObjectState,
  TScope = string
>(
  scope: MoleculeScope<TScope>,
  createMolecule: (
    scope: TScope,
    getMolecule: MoleculeGetter,
    getScope: ScopeGetter
  ) => TObject
) {
  return molecule((getMolecule: MoleculeGetter, getScope: ScopeGetter) => {
    const id = getScope<TScope>(scope);

    return atomWithWebStorage(
      `${id?.toString()}`,
      createMolecule(id, getMolecule, getScope)
    );
  });
}*/
