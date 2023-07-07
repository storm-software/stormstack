import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { ToastMessage, toastMessagesAtom } from "../state/toast-messages";
import { UseAtomListReturn, useAtomList } from "./useAtomList";
import { ToastVariants } from "@open-system/design-system-components";

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

export const useSetToastError = (): ((summary: string, details?: string) => void)  => {
  const { add } = useSetToastMessages();

  return useCallback((summary: string, details?: string) => {
    add({
      type: ToastVariants.ERROR,
      summary,
      details
    })
  }, [])
};