import { ProgressTrackerItemType } from "@open-system/core-components";
import { ScopedObjectState, atomWithList } from "@open-system/core-data-access";

export type ContactFormProgressStep = ScopedObjectState &
  ProgressTrackerItemType;

export const contactFormProgressAtom = atomWithList<ContactFormProgressStep>(
  [],
  {
    allowDuplicates: false,
  }
);
