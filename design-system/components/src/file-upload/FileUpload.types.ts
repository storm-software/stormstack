import { FileState } from "@open-system/core-utilities";
import { FileWithPath } from "file-selector";
import { RefObject } from "react";
import { PropsWithBaseField, PropsWithBaseRef } from "../types";

export interface FileError {
  message: string;
  code: string;
}

export interface FileRejection {
  file: FileState;
  errors: FileError[];
}

export interface UseDropzoneParams {
  files: FileState[];
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
  getFilesFromEvent: (
    evt: Event | any
  ) => Promise<(FileWithPath | DataTransferItem)[]>;
  maxSize: number;
  minSize: number;
  multiple: boolean;
  maxFiles: number;
  preventDropOnDocument: boolean;
  noClick: boolean;
  noKeyboard: boolean;
  noDrag: boolean;
  noDragEventsBubbling: boolean;
  validator: (file: File, event?: DragEvent | Event) => boolean;
  useFsAccessApi: boolean;
  autoFocus: boolean;
  accept: string | string[];
  onDragEnter: (event: DragEvent) => void;
  onDragLeave: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDrop: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DragEvent | Event
  ) => void;
  onDropAccepted: (files: File[], event: DragEvent | Event) => void;
  onDropRejected: (
    fileRejections: FileRejection[],
    event: DragEvent | Event
  ) => void;
  onFileDialogCancel: (event: any) => void;
  onFileDialogOpen: (event: any) => void;
  onError: (error: Error) => void;
  onInclude: (files: Array<File>) => void;
  onExclude: (fileId: string) => void;
  onReset: () => void;
}

export type DropzoneRootProps = PropsWithBaseRef<{
  refKey?: string;
  [key: string]: any;
}>;

export type DropzoneInputProps = PropsWithBaseField<{
  refKey?: string;
  [key: string]: any;
}>;
