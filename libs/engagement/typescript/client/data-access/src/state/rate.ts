import { atomWithWebStorage } from "@stormstack/core-client-data-access";
import {
  UniqueIdGenerator,
  isDevelopment
} from "@stormstack/core-shared-utilities";
import { Rate, TotalRate } from "@stormstack/engagement-shared-data-access";
import { atomFamily } from "jotai/utils";

export const rateFamily = atomFamily((contentId: string) => {
  const baseAtom = atomWithWebStorage<Rate>(`user-rate-${contentId}`, {
    id: UniqueIdGenerator.generate(),
    contentId,
    rate: 0
  });
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  return baseAtom;
});

export const totalRateFamily = atomFamily((contentId: string) => {
  const baseAtom = atomWithWebStorage<TotalRate>(`total-rate-${contentId}`, {
    id: UniqueIdGenerator.generate(),
    contentId,
    rate: 0,
    count: 0
  });
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  return baseAtom;
});
