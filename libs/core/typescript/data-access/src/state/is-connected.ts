import { IsServer } from "@open-system/core-utilities";
import { atom } from "jotai";
import { atomWithWebStorage } from "../utilities/atomWithWebStorage";
import { connectionManager } from "../utilities/connection-manager";

const onlineEvents = ["online", "offline"] as const;

export const isConnectedAtom = atomWithWebStorage<boolean>("connected", true);
isConnectedAtom.onMount = (setAtom: (next: boolean) => void) => {
  const unsubscribe = connectionManager.subscribe(() =>
    setAtom(connectionManager.isOnline())
  );

  return () => {
    unsubscribe();
  };
};
