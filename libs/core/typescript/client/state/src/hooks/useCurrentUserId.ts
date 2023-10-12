import { useAtomValue } from "jotai";
import { currentUserIdAtom } from "../state/current-user-id";

export const useCurrentUserId = (): string => {
  return useAtomValue(currentUserIdAtom);
};
