import { getUniqueId } from "@open-system/core-shared-utilities";
import { atomWithWebStorage } from "../utilities/atomWithWebStorage";

export const currentUserIdAtom = atomWithWebStorage<string>(
  "user-id",
  getUniqueId()
);
