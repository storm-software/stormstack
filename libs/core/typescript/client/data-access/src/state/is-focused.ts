import { atomWithWebStorage } from '../utilities/atomWithWebStorage';
import { focusManager } from '../utilities/focus-manager';

export const isFocusedAtom = atomWithWebStorage<boolean>('focused', true);
isFocusedAtom.onMount = (setAtom: (next: boolean) => void) => {
  const unsubscribe = focusManager.subscribe(() =>
    setAtom(focusManager.isFocused())
  );

  return () => {
    unsubscribe();
  };
};
