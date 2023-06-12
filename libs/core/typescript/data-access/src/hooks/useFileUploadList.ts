import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { FileUploadState, fileUploadFamily } from "../models/form";
import { useFormId } from "./useFormId";

export type UseFileUploadListReturn = {
  include: (files: Array<File>) => void;
  exclude: (fileId: string) => void;
  reset: () => void;
};

export const useFileUploadListValue = (params: {
  field: string;
  formId?: string;
}): FileUploadState[] => {
  const formId = useFormId();
  return useAtomValue(
    fileUploadFamily({ field: params.field, formId: params.formId ?? formId })
  );
};

export const useSetFileUploadList = (params: {
  field: string;
  formId?: string;
}): UseFileUploadListReturn => {
  const formId = useFormId();

  const setFileUploadList = useSetAtom(
    fileUploadFamily({ field: params.field, formId: params.formId ?? formId })
  );
  const include = useCallback(
    async (files: Array<File>) => {
      await setFileUploadList({ type: "include", files });
    },
    [setFileUploadList]
  );

  const exclude = useCallback(
    (fileId: string) => {
      setFileUploadList({ type: "exclude", fileId });
    },
    [setFileUploadList]
  );

  const reset = useCallback(() => {
    setFileUploadList({ type: "reset" });
  }, [setFileUploadList]);

  return { include, exclude, reset };
};

export const useFileUploadList = (params: {
  field: string;
  formId?: string;
}): [FileUploadState[], UseFileUploadListReturn] => {
  return [useFileUploadListValue(params), useSetFileUploadList(params)];
};
