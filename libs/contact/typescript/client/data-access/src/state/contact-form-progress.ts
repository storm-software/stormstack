import { ProgressTrackerItemType } from "@stormstack/core-client-components";
import { atomWithList } from "@stormstack/core-client-data-access";
import { ScopedObjectState } from "@stormstack/core-shared-data-access";

export type ContactFormProgressStep = ScopedObjectState &
  ProgressTrackerItemType;

export const contactFormProgressAtom = atomWithList<ContactFormProgressStep>(
  [],
  {
    allowDuplicates: false
  }
);
