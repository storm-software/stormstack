/* eslint-disable @typescript-eslint/no-unused-vars */
import { atomWithWebStorage } from "@open-system/core-client-data-access";
import { DateTime } from "@open-system/core-shared-utilities";
import { UserTypes } from "@open-system/user-management-shared-data-access";
import { Getter, Setter, atom } from "jotai";

export const userNameAtom = atomWithWebStorage<string>("user-name", "Guest");

export const userTypeAtom = atomWithWebStorage<UserTypes>(
  "user-type",
  UserTypes.GUEST
);

export const createdOnAtom = atomWithWebStorage<DateTime>(
  "created-on",
  DateTime.current
);

export const lastActiveOnAtom = atomWithWebStorage<DateTime>(
  "last-active-on",
  DateTime.current
);

export const hasAgreedToPrivacyPolicyAtom = atomWithWebStorage<boolean>(
  "privacy-policy",
  false
);

export const storeVisitAtom = atom<null, [], void>(
  null,
  (get: Getter, set: Setter) => {
    const createdOn = get(createdOnAtom);
    !createdOn && set(createdOnAtom, DateTime.current);

    set(lastActiveOnAtom, DateTime.current);
  }
);
