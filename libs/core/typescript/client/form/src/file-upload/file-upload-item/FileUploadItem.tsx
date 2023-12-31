"use client";

import { openDataInNewTab } from "@stormstack/core-client-utilities";
import {
  FileUploadItem as OsFileUploadItem,
  PropsWithBase
} from "@stormstack/design-system-components";
import { Atom, useAtomValue } from "jotai";
import { useCallback } from "react";
import { FileUploadFieldState } from "../../types";

export type FileUploadProps = PropsWithBase<{
  fileAtom: Atom<Promise<FileUploadFieldState>>;
  onRemoveFile: (name: string) => void;
}>;

/**
 * The base FileUploadItem component used by the Open System repository
 */
export const FileUploadItem = ({
  fileAtom,
  onRemoveFile,
  ...props
}: FileUploadProps) => {
  const fileState = useAtomValue(fileAtom);
  //const [, startTransition] = useTransition();

  /*const [content, setContent] = useState<{
    dataUrl?: string;
    data?: string;
    error?: FileLoadingError;
    type?: string;
  } | null>(null);
  useEffect(() => {
    startTransition(() => {

    });
  }, [fileState.file]);*/

  /*const file = fileState.file;
  const dataUrlPromise = readAsDataURLAsync(file);
  const dataPromise = readAsTextAsync(file);

  Promise.all([dataUrlPromise, dataPromise])
    .then((promises: any[]) => {
      if (Array.isArray(promises) && promises.length > 1) {
        setContent({
          dataUrl: promises[0],
          data: promises[1],
          error: undefined,
          type: file.type,
        });
      }
    })
    .catch((e: Error) => {
      const error = e as FileLoadingError;
      ConsoleLogger.error(error?.message);

      setContent({
        dataUrl: undefined,
        data: undefined,
        error,
        type: "error/FileLoadingError",
      });
    });*/

  const handleOpenFile = useCallback(() => {
    fileState.file.name &&
      openDataInNewTab(
        fileState.file.name,
        {
          dataUrl: fileState.dataUrl,
          data: fileState.data,
          error: fileState.errors?.join("\r\n"),
          type: fileState.file.type
        },
        `Pat Sullivan Development - Viewing ${fileState.file.name}`
      );
  }, [fileState]);
  const handleRemoveFile = useCallback(() => {
    onRemoveFile(fileState.file.name);
  }, [fileState.file.name, onRemoveFile]);

  return (
    <OsFileUploadItem
      name={fileState.file.name}
      size={fileState.file.size}
      dataUrl={fileState?.dataUrl}
      error={fileState.errors?.join("\r\n")}
      onOpenFile={handleOpenFile}
      onRemoveFile={handleRemoveFile}
    />
  );
};
