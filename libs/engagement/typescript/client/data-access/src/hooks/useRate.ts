import { Rate, TotalRate } from "@stormstack/engagement-shared-data-access";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { rateFamily, totalRateFamily } from "../state/rate";

export const useRateValue = (contentId: string): Rate => {
  return useAtomValue(useMemo(() => rateFamily(contentId), [contentId]));
};

export const useSetRate = (contentId: string): ((rate: Rate) => void) => {
  return useSetAtom(useMemo(() => rateFamily(contentId), [contentId]));
};

export const useRate = (contentId: string): [Rate, (rate: Rate) => void] => {
  return [useRateValue(contentId), useSetRate(contentId)];
};

export const useTotalRateValue = (contentId: string): TotalRate => {
  return useAtomValue(useMemo(() => totalRateFamily(contentId), [contentId]));
};

export const useSetTotalRate = (
  contentId: string
): ((rate: TotalRate) => void) => {
  return useSetAtom(useMemo(() => totalRateFamily(contentId), [contentId]));
};

export const useTotalRate = (
  contentId: string
): [TotalRate, (rate: TotalRate) => void] => {
  return [useTotalRateValue(contentId), useSetTotalRate(contentId)];
};
