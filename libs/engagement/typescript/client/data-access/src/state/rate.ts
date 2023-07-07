import { atomWithWebStorage } from "@open-system/core-client-data-access";
import { getUniqueId, isDevelopment } from "@open-system/core-shared-utilities";
import { Rate, TotalRate } from "@open-system/engagement-shared-data-access";
import { atomFamily } from "jotai/utils";

export const rateFamily = atomFamily((contentId: string) => {
  const baseAtom = atomWithWebStorage<Rate>(`user-rate-${contentId}`, {
    id: getUniqueId(),
    contentId,
    rate: 0,
  });
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  return baseAtom;
});

export const totalRateFamily = atomFamily((contentId: string) => {
  const baseAtom = atomWithWebStorage<TotalRate>(`total-rate-${contentId}`, {
    id: getUniqueId(),
    contentId,
    rate: 0,
    count: 0,
  });
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  return baseAtom;
});
