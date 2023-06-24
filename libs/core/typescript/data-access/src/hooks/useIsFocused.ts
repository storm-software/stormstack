import { useAtomValue } from "jotai";
import { isFocusedAtom } from "../state";

export function useIsFocused() {
  const isFocused = useAtomValue(isFocusedAtom);

  return isFocused;
}
