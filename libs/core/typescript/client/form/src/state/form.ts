import {
  ListAction,
  ListResetAction,
  ScopedObjectState,
  SetStateActionWithReset,
  atomWithList,
  currentUserIdAtom
} from "@stormstack/core-client-state";
import {
  readAsDataURLAsync,
  readAsTextAsync
} from "@stormstack/core-client-utilities";
import {
  MAX_ATTACHMENTS_COUNT,
  MAX_ATTACHMENT_SIZE,
  checkFileUploadValidations
} from "@stormstack/core-shared-state";
import {
  UniqueIdGenerator,
  isDevelopment,
  isEmpty,
  isFunction
} from "@stormstack/core-shared-utilities";
import { Getter, PrimitiveAtom, Setter, atom } from "jotai";
import { RESET, atomFamily, atomWithReset, splitAtom } from "jotai/utils";
import {
  FileFormFieldConfig,
  FileUploadFieldState,
  FormFieldConfig
} from "../types";
import { isFormFieldEqual } from "../utilities";

export const DefaultFileFormFieldConfig: Omit<
  FileFormFieldConfig,
  "formId" | "field"
> = {
  type: "file",
  multiple: true,
  minFiles: 0,
  maxFiles: MAX_ATTACHMENTS_COUNT,
  minSizeInBytes: 0,
  maxSizeInBytes: MAX_ATTACHMENT_SIZE,
  allowedFiles: [
    ".docx",
    ".pdf",
    ".jpeg",
    ".png",
    ".gif",
    ".avif",
    ".webp",
    ".svg",
    ".txt",
    ".json"
  ]
};

export const formIdAtom = atom<string>("");

export const formFieldConfigFamily = atomFamily(
  ({ field, formId }: { field: string; formId: string }) => {
    const baseAtom = atomWithReset<FormFieldConfig>({
      field,
      formId,
      type: "input",
      valueType: "string"
    });
    if (isDevelopment()) {
      baseAtom.debugPrivate = true;
    }

    const returnedAtom = atom(
      get => get(baseAtom),
      (get, set, action: SetStateActionWithReset<Partial<FormFieldConfig>>) => {
        if (action === RESET || isFunction(action)) {
          set(baseAtom, action as SetStateActionWithReset<FormFieldConfig>);
        } else if ((action as FormFieldConfig)?.type === "file") {
          const config = action as FileFormFieldConfig;
          set(baseAtom, {
            ...config,
            multiple: !isEmpty(config.multiple)
              ? config.multiple
              : DefaultFileFormFieldConfig.multiple,
            minFiles: !isEmpty(config.minFiles)
              ? config.minFiles
              : DefaultFileFormFieldConfig.minFiles,
            maxFiles: !isEmpty(config.maxFiles)
              ? config.maxFiles
              : DefaultFileFormFieldConfig.maxFiles,
            minSizeInBytes: !isEmpty(config.minSizeInBytes)
              ? config.minSizeInBytes
              : DefaultFileFormFieldConfig.minSizeInBytes,
            maxSizeInBytes: !isEmpty(config.maxSizeInBytes)
              ? config.maxSizeInBytes
              : DefaultFileFormFieldConfig.maxSizeInBytes,
            allowedFiles: !isEmpty(config.allowedFiles)
              ? config.allowedFiles
              : DefaultFileFormFieldConfig.allowedFiles,
            field,
            formId
          } as FileFormFieldConfig);
        }
      }
    );
    if (isDevelopment()) {
      returnedAtom.debugPrivate = true;
    }

    return returnedAtom;
  },
  isFormFieldEqual
);

export type FileUploadIncludeAction = {
  type: "include";
  files: Array<File>;
};

export type FileUploadExcludeAction = { type: "exclude"; name: string };

export type FileUploadAction =
  | FileUploadIncludeAction
  | FileUploadExcludeAction
  | ListResetAction<FileUploadFieldState>;

export const fileUploadFamily = atomFamily(
  ({ field, formId }: { field: string; formId: string }) => {
    const baseAtom = atom<FileUploadFieldState[]>([]);
    if (isDevelopment()) {
      baseAtom.debugPrivate = true;
    }

    const wrapperBaseAtom = atom(
      (get: Getter) => get(baseAtom),
      (
        get: Getter,
        set: Setter,
        action: SetStateActionWithReset<FileUploadFieldState[]>
      ) => {
        if (action === RESET) {
          set(baseAtom, []);
        } else {
          set(baseAtom, action as FileUploadFieldState[]);
        }
      }
    );
    if (isDevelopment()) {
      wrapperBaseAtom.debugPrivate = true;
    }

    const fileAtomAtoms = splitAtom(
      wrapperBaseAtom,
      (item: FileUploadFieldState) => item.id
    );
    if (isDevelopment()) {
      fileAtomAtoms.debugPrivate = true;
    }

    const extractedFileAtom = atom(get =>
      splitAtom(
        atom(
          get(fileAtomAtoms).map(
            async (uploadedFileAtom: PrimitiveAtom<FileUploadFieldState>) => {
              const uploadedFile = get(uploadedFileAtom);
              //try {
              const dataUrlPromise = readAsDataURLAsync(uploadedFile.file);
              const dataPromise = readAsTextAsync(uploadedFile.file);

              const [dataUrl, data] = await Promise.all([
                dataUrlPromise,
                dataPromise
              ]);

              typeof dataUrl === "string" && (uploadedFile.dataUrl = dataUrl);
              typeof data === "string" && (uploadedFile.data = data);
              /*} catch (e) {
          uploadedFile.error = e as FileLoadingError;
          ConsoleLogger.error(uploadedFile.error?.message);
        }*/

              return uploadedFile;
            }
          )
        )
      )
    );

    const returnedAtom = atom(
      get => get(extractedFileAtom),
      (get, set, action: FileUploadAction) => {
        const errorMessageAtom = fileUploadErrorMessageFamily({
          field,
          formId
        });
        if (
          action.type === "include" &&
          (action as FileUploadIncludeAction)?.files
        ) {
          const files = (action as FileUploadIncludeAction).files;
          if (files.length) {
            const existingFileAtoms = get(fileAtomAtoms);

            let errors: Record<string, string[]> = {};
            for (const file of files) {
              for (const existingFileAtom of existingFileAtoms) {
                const existingFile = get(existingFileAtom);
                if (existingFile.originalFileName === file.name) {
                  set(fileAtomAtoms, {
                    type: "remove",
                    atom: existingFileAtom
                  });
                  set(errorMessageAtom, {
                    type: "remove",
                    id: existingFile.id
                  });
                }
              }

              const config = get(formFieldConfigFamily({ formId, field }));
              if (config.type === "file") {
                errors = checkFileUploadValidations(
                  files,
                  existingFileAtoms.length,
                  config as FileFormFieldConfig
                );

                file &&
                  set(fileAtomAtoms, {
                    type: "insert",
                    value: {
                      id: UniqueIdGenerator.generate(),
                      field,
                      formId,
                      file,
                      fileName: `${get(
                        currentUserIdAtom
                      )}-${UniqueIdGenerator.generate()}.${file.type}`,
                      originalFileName: file.name,
                      errors: errors[file.name]
                    }
                  });

                if (errors[file.name].length > 0) {
                  set(errorMessageAtom, {
                    type: "add",
                    item: { id: file.name }
                  });
                }
              }
            }
          }
        } else if (
          action.type === "exclude" &&
          (action as FileUploadExcludeAction)?.name
        ) {
          const name = (action as FileUploadExcludeAction).name;
          const existingFileAtoms = get(fileAtomAtoms);

          for (const existingFileAtom of existingFileAtoms) {
            const existingFile = get(existingFileAtom);
            if (existingFile.originalFileName === name) {
              set(fileAtomAtoms, { type: "remove", atom: existingFileAtom });
              set(errorMessageAtom, {
                type: "remove",
                id: existingFile.originalFileName
              });
            }
          }
        } else if (action.type === "reset") {
          set(wrapperBaseAtom, RESET);
          set(errorMessageAtom, action);
        }
      }
    );
    if (isDevelopment()) {
      returnedAtom.debugPrivate = true;
    }

    return returnedAtom;
  },
  isFormFieldEqual
);

export const fileUploadErrorMessageFamily = atomFamily(
  (params: { field: string; formId: string }) => {
    const errorFileListAtom = atomWithList<ScopedObjectState>([]);
    if (isDevelopment()) {
      errorFileListAtom.debugPrivate = true;
    }

    const returnedAtom = atom<string, [ListAction<ScopedObjectState>], void>(
      get =>
        get(errorFileListAtom).reduce(
          (ret: string, { id }: ScopedObjectState) => ret + `\r\n${id}`,
          "Please remove the following files: "
        ),
      (get: Getter, set: Setter, action: ListAction<ScopedObjectState>) => {
        set(errorFileListAtom, action);
      }
    );
    if (isDevelopment()) {
      returnedAtom.debugPrivate = true;
    }

    return returnedAtom;
  }
);
