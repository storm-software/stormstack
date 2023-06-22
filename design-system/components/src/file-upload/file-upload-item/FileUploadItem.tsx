"use client";

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Link } from "../../link";
import { PropsWithBase } from "../../types";
import { getSvgFillStyle } from "../../utilities/svg-style-utils";

export type FileUploadItemProps = PropsWithBase<{
  name: string;
  size: number;
  dataUrl?: string;
  error?: string;
  onOpenFile: () => void;
  onRemoveFile: () => void;
}>;

/**
 * The base FileUploadItem component used by the Open System repository
 */
export const FileUploadItem = ({
  name,
  size,
  error,
  dataUrl,
  onOpenFile,
  onRemoveFile,
  ...props
}: FileUploadItemProps) => {
  return (
    <li
      className={clsx(
        "group relative min-h-fit overflow-hidden rounded-lg border-2 hover:border-hover-link-2",
        { "border-primary bg-slate-600/60 hover:bg-slate-800/60": !error },
        { "border-error bg-red-900/60": error }
      )}>
      <div className="flex min-h-fit flex-row items-center gap-2 p-3 transition-all group-hover:blur-sm group-hover:brightness-50">
        {!error ? (
          <>
            <div className="justify-left flex flex-1 grow">
              <label className="text-md w-full cursor-pointer truncate text-left font-label-3 text-primary">
                {name}
              </label>
            </div>
            <label className="font-body-2 text-sm text-body-1">
              {size && size > 1000 ? size / 1000 : "> 1"} KB
            </label>
          </>
        ) : (
          <div className="flex w-full flex-row items-center gap-6">
            <span className="z-30 inline-flex h-fit">
              <svg
                className="inline-flex h-7 w-7"
                viewBox="0 0 25 25"
                tabIndex={-1}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4035 5.59644 25 12.5 25C19.4035 25 25 19.4035 25 12.5C25 5.59644 19.4035 0 12.5 0ZM13.6364 6.81818C13.6364 6.19059 13.1276 5.68182 12.5 5.68182C11.8724 5.68182 11.3636 6.19059 11.3636 6.81818V13.6364C11.3636 14.264 11.8724 14.7727 12.5 14.7727C13.1276 14.7727 13.6364 14.264 13.6364 13.6364V6.81818ZM13.6364 17.6136C13.6364 16.986 13.1276 16.4773 12.5 16.4773C11.8724 16.4773 11.3636 16.986 11.3636 17.6136V18.1818C11.3636 18.8094 11.8724 19.3182 12.5 19.3182C13.1276 19.3182 13.6364 18.8094 13.6364 18.1818V17.6136Z"
                  className={getSvgFillStyle(true)}
                />
              </svg>
            </span>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-md font-label-3 font-black text-primary">
                {name}
              </label>
              <label className="whitespace-pre-line font-label-3 text-sm text-error">
                {error}
              </label>
            </div>
          </div>
        )}
      </div>
      {dataUrl && (
        <>
          {!error ? (
            <>
              <div className="absolute left-4 top-0 z-30 flex h-full w-fit -translate-x-96 items-center transition-all delay-200 group-hover:translate-x-0">
                <a href={dataUrl} download={name}>
                  <ArrowDownTrayIcon
                    title={`Download ${name}`}
                    className="transition-color h-6 cursor-pointer text-primary hover:text-hover-link-2"
                  />
                </a>
              </div>
              <div className="absolute left-0 right-0 top-0 z-10 flex h-full w-full flex-row items-center justify-center">
                <div onClick={onOpenFile} className="z-10 flex h-full w-2/3">
                  <Link className="m-auto cursor-pointer truncate text-center opacity-0 transition-opacity group-hover:opacity-100">
                    Open {name}
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute left-4 top-0 z-30 flex h-full w-fit max-w-[70%] -translate-x-96 items-center transition-all delay-200 group-hover:translate-x-0">
              <Link
                onClick={onRemoveFile}
                className="cursor-pointer truncate text-error">
                Remove {name}
              </Link>
            </div>
          )}
        </>
      )}
      <div className="absolute right-4 top-0 z-30 flex h-full w-fit translate-x-96 cursor-pointer items-center transition-all delay-200 group-hover:translate-x-0">
        <XMarkIcon
          onClick={onRemoveFile}
          title={`Remove ${name}`}
          className={clsx(
            "transition-color h-7 cursor-pointer hover:text-hover-link-2",
            { "text-primary": !error },
            { "text-error": error }
          )}
        />
      </div>
    </li>
  );
};
