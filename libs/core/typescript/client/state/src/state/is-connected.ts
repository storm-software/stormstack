import { atomWithWebStorage } from "../utilities/atomWithWebStorage";
import { connectionManager } from "../utilities/connection-manager";

export const isConnectedAtom = atomWithWebStorage<boolean>("connected", true);
isConnectedAtom.onMount = (setAtom: (next: boolean) => void) => {
  const unsubscribe = connectionManager.subscribe(() =>
    setAtom(connectionManager.isOnline())
  );

  return () => {
    unsubscribe();
  };
};
