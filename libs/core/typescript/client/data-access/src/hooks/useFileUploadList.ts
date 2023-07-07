import { Atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { FileUploadState, fileUploadFamily } from "../state/form";
import { useFormId } from "./useFormId";

export type UseFileUploadListReturn = {
  include: (files: Array<File>) => void;
  exclude: (name: string) => void;
  reset: () => void;
};

export const useFileUploadListValue = (params: {
  field: string;
  formId?: string;
}): Atom<Promise<FileUploadState>>[] => {
  const formId = useFormId();
  return useAtomValue(
    useAtomValue(
      fileUploadFamily({
        field: params.field,
        formId: params.formId ?? formId,
      })
    )
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
    (files: Array<File>) => {
      setFileUploadList({ type: "include", files });
    },
    [setFileUploadList]
  );

  const exclude = useCallback(
    (name: string) => {
      setFileUploadList({ type: "exclude", name });
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
}): [Atom<Promise<FileUploadState>>[], UseFileUploadListReturn] => {
  return [useFileUploadListValue(params), useSetFileUploadList(params)];
};

export const useFileUploadErrors = (params: {
  field: string;
  formId?: string;
}) => {
  /*const formId = useFormId();

  const { setError, clearErrors, trigger } = useFormContext();
  const error = useFieldErrors(params.field);
  const nextError = useAtomValue(
        useMemo(() => fileUploadErrorMessageFamily({
          field: params.field,
          formId: params.formId ?? formId,
        }), [params, formId])
  );

  useEffect(() => {
    if (nextError !== error?.[params.field]) {
      if (nextError) {
        setError(params.field, { type: "file", message: nextError });
      } else if (!isEmpty(error?.[params.field])) {
        clearErrors(params.field);
      }
      trigger();
    }
  }, [error, nextError]);*/
};
