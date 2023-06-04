import { DateTime } from "@open-system/core-utilities";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import {
  UserTypes,
  createdOnAtom,
  hasAgreedToPrivacyPolicyAtom,
  lastActiveOnAtom,
  storeVisitAtom,
  userIdAtom,
  userNameAtom,
  userTypeAtom,
} from "../models/current-user";

export const useCurrentUserId = (): string => useAtomValue<string>(userIdAtom);

export const useCurrentUserName = (): string =>
  useAtomValue<string>(userNameAtom);

export const useCurrentUserType = (): UserTypes =>
  useAtomValue<UserTypes>(userTypeAtom);

export const useCreatedOn = (): DateTime =>
  useAtomValue<DateTime>(createdOnAtom);

export const useLastActiveOn = (): DateTime =>
  useAtomValue<DateTime>(lastActiveOnAtom);

export const useStoreVisit = () => useSetAtom(storeVisitAtom);

export const useHasAgreedToPrivacyPolicy = (): boolean =>
  useAtomValue<boolean>(hasAgreedToPrivacyPolicyAtom);
export const useAgreeToPrivacyPolicy = () => {
  const setHasAgreedToPrivacyPolicy = useSetAtom(hasAgreedToPrivacyPolicyAtom);
  return useCallback(() => {
    setHasAgreedToPrivacyPolicy(true);
  }, [setHasAgreedToPrivacyPolicy]);
};
