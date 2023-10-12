import { isDevelopment } from "@stormstack/core-shared-utilities";
import { WritableAtom, atom } from "jotai";

export function atomWithToggle(
  primitive: WritableAtom<boolean, [boolean], void>
): WritableAtom<boolean, [], void> {
  const returnedAtom = atom<boolean, [], void>(
    get => get(primitive),
    (get, set) => set(primitive, !get(primitive))
  );
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
}
