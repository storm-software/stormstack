import { FileState } from "@open-system/core-utilities";
import { FileWithPath } from "file-selector";
import { DragEvent, DragEventHandler, RefObject, SyntheticEvent } from "react";
import { PropsWithBaseField, PropsWithBaseRef } from "../types";

export interface FileError {
  message: string;
  code: string;
}

export interface FileRejection {
  file: FileState;
  errors: FileError[];
}

export interface FileEnvelop {
  file: File;
  errors: FileError[];
}

export interface UseDropzoneParams {
  files?: FileState[];
  inputRef: RefObject<HTMLInputElement>;
  disabled?: boolean;
  getFilesFromEvent?: (
    evt: Event | any
  ) => Promise<(FileWithPath | DataTransferItem)[]>;
  maxSizeInBytes?: number;
  minSizeInBytes?: number;
  multiple?: boolean;
  maxFiles?: number;
  minFiles?: number;
  allowedFiles?: string[];
  validator?: (file: File) => string[];
  preventDropOnDocument?: boolean;
  noClick?: boolean;
  noKeyboard?: boolean;
  noDrag?: boolean;
  noDragEventsBubbling?: boolean;
  useFsAccessApi?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  onDragEnter?: DragEventHandler<HTMLInputElement>;
  onDragLeave?: DragEventHandler<HTMLInputElement>;
  onDragOver?: DragEventHandler<HTMLInputElement>;
  onDrop?: DragEventHandler<HTMLInputElement>;
  onDropAccepted?: (
    files: File[],
    event: DragEvent<HTMLInputElement> | Event
  ) => void;
  onDropRejected?: (
    fileRejections: FileRejection[],
    event: DragEvent<HTMLInputElement> | Event
  ) => void;
  onFileDialogCancel?: (event: any) => void;
  onFileDialogOpen?: (event: any) => void;
  onError?: (error: SyntheticEvent<HTMLInputElement, Event>) => void;
  /**
   * Event handler for file included event
   */
  onAddFiles: (files: Array<File>) => void;

  /**
   * Event handler for reset included files event
   */
  onResetFiles: () => void;
}

export type DropzoneRootProps = PropsWithBaseRef<{
  refKey?: string;
  [key: string]: any;
}>;

export type DropzoneInputProps = PropsWithBaseField<{
  refKey?: string;
  [key: string]: any;
}>;
