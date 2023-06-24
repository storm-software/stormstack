import { isConnectedAtom } from "../state";
import { useAtomValue } from "jotai";

export function useIsConnected() {
  const isConnected = useAtomValue(isConnectedAtom);

  return isConnected;
}
