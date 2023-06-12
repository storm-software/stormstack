import {
  ConsoleLogger,
  DateTime,
  FileLoadingError,
  FileState,
  readAsDataURLAsync,
  readAsTextAsync,
} from "@open-system/core-utilities";
import { ToastVariants } from "@open-system/design-system-components";
import { atom } from "jotai";
import { createScope, molecule } from "jotai-molecules";
import { atomFamily } from "jotai/utils";
import { ScopedObjectState } from "../types";
import { ListResetAction, atomWithList } from "../utilities/atomWithList";
import { toastMessagesAtom } from "./toast-messages";

export const FormIdScope = createScope<string>("");
export const formIdMolecule = molecule((getMolecule, getScope) => {
  const formId = getScope(FormIdScope);
  return atom(formId);
});

export type FileUploadState = ScopedObjectState &
  FileState & {
    field: string;
    formId: string;
    dataUrl?: string;
    data?: string;
    type: string;
    size: number;
    lastModifiedDateTime: DateTime;
    error?: FileLoadingError;
  };

export type FileUploadIncludeAction = {
  type: "include";
  files: Array<File>;
};

export type FileUploadExcludeAction = { type: "exclude"; fileId: string };

export type FileUploadAction =
  | FileUploadIncludeAction
  | FileUploadExcludeAction
  | ListResetAction<FileUploadState>;

export const fileUploadFamily = atomFamily(
  ({ field, formId }: { field: string; formId: string }) => {
    const fileUploadListAtom = atomWithList<FileUploadState>([], {
      allowDuplicates: false,
    });

    return atom(
      get => get(fileUploadListAtom),
      async (get, set, action: FileUploadAction) => {
        if (
          action.type === "include" &&
          (action as FileUploadIncludeAction)?.files
        ) {
          const files = (action as FileUploadIncludeAction).files;
          if (files.length) {
            const fileUploadList = get(fileUploadListAtom);

            for (const file of files) {
              const duplicate = fileUploadList.find(
                (existingFile: FileState) => existingFile.name === file.name
              );
              if (duplicate) {
                set(fileUploadListAtom, { type: "remove", id: duplicate.id });
              }

              try {
                const dataUrlPromise = readAsDataURLAsync(file);
                const dataPromise = readAsTextAsync(file);

                const [dataUrl, data] = await Promise.all([
                  dataUrlPromise,
                  dataPromise,
                ]);

                set(fileUploadListAtom, {
                  type: "add",
                  item: {
                    ...file,
                    name: file.name,
                    fileId: file.name,
                    field,
                    formId,
                    lastModifiedDateTime: DateTime.create(
                      BigInt(file.lastModified)
                    ),
                    type: file.type,
                    size: file.size,
                    dataUrl,
                    data,
                  },
                });
              } catch (e) {
                const error = e as FileLoadingError;
                ConsoleLogger.error(error.message);
                set(toastMessagesAtom, {
                  type: "add",
                  item: {
                    type: ToastVariants.ERROR,
                    summary: `Failed to open file '${file.name}' `,
                    details: error.message,
                  },
                });

                set(fileUploadListAtom, {
                  type: "add",
                  item: {
                    ...file,
                    name: file.name,
                    fileId: file.name,
                    field,
                    formId,
                    lastModifiedDateTime: DateTime.create(
                      BigInt(file.lastModified)
                    ),
                    type: file.type,
                    size: file.size,
                    error,
                  },
                });
              }
            }
          }
        } else if (
          action.type === "exclude" &&
          (action as FileUploadExcludeAction)?.fileId
        ) {
          const fileId = (action as FileUploadExcludeAction).fileId;
          const fileUploadList = get(fileUploadListAtom);

          const id = fileUploadList.find(
            (file: FileUploadState) => file.fileId === fileId
          )?.id;
          id && set(fileUploadListAtom, { type: "remove", id });
        } else if (action.type === "reset") {
          set(fileUploadListAtom, { type: "reset" });
        }
      }
    );
  },
  (field1, field2) =>
    field1.field === field2.field && field1.formId === field2.formId
);
