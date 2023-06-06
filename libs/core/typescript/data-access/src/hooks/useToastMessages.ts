import { useAtomValue } from "jotai";
import { ToastMessage, toastMessagesAtom } from "../models/toast-messages";
import { UseAtomListReturn, useAtomList } from "./useAtomList";

export const useToastMessagesValue = (): ToastMessage[] => {
  return useAtomValue(toastMessagesAtom);
};

export const useSetToastMessages = (): UseAtomListReturn<ToastMessage> => {
  return useAtomList(toastMessagesAtom);
};

export const useToastMessages = (): [
  ToastMessage[],
  UseAtomListReturn<ToastMessage>
] => {
  return [useToastMessagesValue(), useSetToastMessages()];
};
