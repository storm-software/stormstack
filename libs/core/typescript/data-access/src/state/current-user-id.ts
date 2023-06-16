import { getUniqueId } from "@open-system/core-utilities";
import { atomWithWebStorage } from "../utilities/atomWithWebStorage";

export const currentUserIdAtom = atomWithWebStorage<string>(
  "user-id",
  getUniqueId()
);
