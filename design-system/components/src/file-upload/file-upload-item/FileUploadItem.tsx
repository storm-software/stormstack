"use client";

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FileState, openFileInNewTab } from "@open-system/core-utilities";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { Link } from "../../link";
import { PropsWithBase } from "../../types";
import { FileError } from "../FileUpload.types";

export type FileUploadProps = PropsWithBase<{
  file: FileState;
  errors?: FileError[];
  onExclude: (fileId: string) => void;
}>;

/**
 * The base FileUploadItem component used by the Open System repository
 */
export const FileUploadItem = ({
  file,
  errors = [],
  onExclude,
  ...props
}: FileUploadProps) => {
  const [dataUrl, setDataUrl] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    errors.length &&
      setError(errors.map((err: FileError) => `${err.message} \r\n`));
    (file as any).error && setError(`${(file as any)?.error.message} \r\n`);
  }, [errors, file]);

  useEffect(() => {
    const data = file?.dataUrl;
    if (data) {
      setDataUrl(data);
    }
  }, [file]);

  const handleOpenFile = useCallback(() => {
    file &&
      openFileInNewTab(
        file,
        `Pat Sullivan Development - Viewing ${file.fileId}`
      );
  }, [file]);
  const handleRemoveFile = useCallback(() => {
    onExclude(file.fileId);
  }, [file.fileId, onExclude]);

  return (
    <li
      key={file.fileId}
      className={clsx(
        "group relative min-h-fit overflow-hidden rounded-lg border-2 hover:border-hover-link-2",
        { "border-primary bg-slate-600/60 hover:bg-slate-800/60": !error },
        { "border-error bg-red-400": error }
      )}>
      <div className="flex min-h-fit flex-row items-center gap-2 p-3 transition-all group-hover:blur-sm group-hover:brightness-50">
        {!error ? (
          <>
            <label className="text-md flex-1 grow font-label-3 text-primary">
              {file.fileId ?? file.name}
            </label>
            <label className="font-body-2 text-sm text-body-1">
              {file.size && file.size > 1000 ? file.size / 1000 : "> 1"} KB
            </label>
          </>
        ) : (
          <>
            {!dataUrl && !error ? (
              <>
                <label className="text-md flex-1 grow font-label-3 text-primary">
                  Loading...
                </label>
                <div role="status" className="pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 animate-spin fill-inverse text-primary ease-in-out"
                    viewBox="0 0 100 101"
                    fill="none">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </>
            ) : (
              <label className="text-md flex-1 grow font-label-3 text-error">
                {file.fileId ?? file.name} - {error}
              </label>
            )}
          </>
        )}
      </div>

      {dataUrl && !error && (
        <>
          <div className="absolute left-4 top-0 z-30 flex h-full w-fit -translate-x-96 items-center transition-all delay-200 group-hover:translate-x-0">
            <a href={dataUrl} download={file.name}>
              <ArrowDownTrayIcon className="transition-color h-6 cursor-pointer text-primary hover:text-hover-link-2" />
            </a>
          </div>
          <div
            onClick={handleOpenFile}
            className="absolute left-0 top-0 z-10 flex h-full w-full items-center">
            <Link className="m-auto w-2/3 max-w-fit truncate whitespace-nowrap text-center opacity-0 transition-opacity group-hover:opacity-100">
              Open {file.name}
            </Link>
          </div>
        </>
      )}
      <div className="absolute right-4 top-0 z-30 flex h-full w-fit translate-x-96 cursor-pointer items-center transition-all delay-200 group-hover:translate-x-0">
        <XMarkIcon
          onClick={handleRemoveFile}
          className={clsx(
            "transition-color h-6 w-6 cursor-pointer hover:text-hover-link-2",
            { "text-primary": !error },
            { "text-error": error }
          )}
        />
      </div>
    </li>
  );
};
