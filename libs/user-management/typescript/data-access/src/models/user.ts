/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateTime } from "@open-system/core-utilities";
import { moleculeWithWebStorage, BaseMolecule } from "@open-system/core-data-access";
import { atom } from "jotai";
import { createScope } from "jotai-molecules";
import { MoleculeGetter, ScopeGetter } from "jotai-molecules/dist/molecule";

export type UserTypes = "internal" | "external" | "guest";
export const UserTypes = {
  INTERNAL: "internal" as UserTypes,
  EXTERNAL: "external" as UserTypes,
  GUEST: "guest" as UserTypes,
};

export interface User {
  name: string;
  type: UserTypes;
  createdDateTime: string;
  hasAgreedToPrivacyPolicy: boolean;
  lastActiveDateTime: string;
}

export type UserMolecule = BaseMolecule<User>;

export const UserScope = createScope<string>("UserId-000001");

export const UserMolecule = moleculeWithWebStorage(
  UserScope,
  (id: string | undefined, _: MoleculeGetter, __: ScopeGetter) => {
    const typeAtom = atom<UserTypes>(UserTypes.GUEST);
    const nameAtom = atom<string>("Guest");
    const createdDateTimeAtom = atom<DateTime>(DateTime.current);
    const lastActiveDateTimeAtom = atom<DateTime>(DateTime.current);
    const hasAgreedToPrivacyPolicyAtom = atom<boolean>(false);    

    return {
      id,
      nameAtom,
      typeAtom,
      createdDateTimeAtom,
      lastActiveDateTimeAtom,
      hasAgreedToPrivacyPolicyAtom,
    };
  }
);
