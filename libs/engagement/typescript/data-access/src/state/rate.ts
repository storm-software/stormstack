import { atomWithWebStorage } from '@open-system/core-data-access';
import { getUniqueId, isDevelopment } from '@open-system/core-utilities';
import { atomFamily } from 'jotai/utils';
import { Rate, TotalRate } from '../types';

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
