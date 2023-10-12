import { UniqueIdGenerator } from "@stormstack/core-shared-utilities";
import { atomWithWebStorage } from "../utilities/atomWithWebStorage";

export const currentUserIdAtom = atomWithWebStorage<string>(
  "user-id",
  UniqueIdGenerator.generate()
);
