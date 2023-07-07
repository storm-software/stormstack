import { ProgressTrackerItemType } from "@open-system/core-client-components";
import { atomWithList } from "@open-system/core-client-data-access";
import { ScopedObjectState } from "@open-system/core-shared-data-access";

export type ContactFormProgressStep = ScopedObjectState &
  ProgressTrackerItemType;

export const contactFormProgressAtom = atomWithList<ContactFormProgressStep>(
  [],
  {
    allowDuplicates: false,
  }
);
