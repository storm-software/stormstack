import { useAtomValue } from "jotai";
import { Alert, alertsAtom } from "../models/toast-messages";
import { UseAtomListReturn, useAtomList } from "./useAtomList";

export const useToastMessagesValue = (): ToastMessage[] => {
  return useAtomValue(alertsAtom);
};

export const useSetToastMessages = (): UseAtomListReturn<ToastMessage> => {
  return useAtomList(alertsAtom);
};

export const useToastMessages = (): [ToastMessage[], UseAtomListReturn<ToastMessage>] => {
  return [useToastMessagesValue(), useSetToastMessages()];
};
