/* eslint-disable @typescript-eslint/no-unused-vars */
import { atomWithWebStorage } from "@open-system/core-data-access";
import { DateTime, getGuid } from "@open-system/core-utilities";
import { Getter, Setter, atom } from "jotai";

export type UserTypes = "internal" | "external" | "guest";
export const UserTypes = {
  INTERNAL: "internal" as UserTypes,
  EXTERNAL: "external" as UserTypes,
  GUEST: "guest" as UserTypes,
};

export const userIdAtom = atomWithWebStorage<string>("user-id", getGuid());

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
