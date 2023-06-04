import { useAtomValue } from "jotai";
import { Alert, alertsAtom } from "../models/alerts";
import { UseAtomListReturn, useAtomList } from "./useAtomList";

export const useAlertsValue = (): Alert[] => {
  return useAtomValue(alertsAtom);
};

export const useSetAlerts = (): UseAtomListReturn<Alert> => {
  return useAtomList(alertsAtom);
};

export const useAlerts = (): [Alert[], UseAtomListReturn<Alert>] => {
  return [useAlertsValue(), useSetAlerts()];
};
