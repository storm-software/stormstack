"use client";

import {
  FileUploadState,
  FormFieldConfig,
  useFieldErrors,
  useFieldRegistration,
  useFieldValue,
  useFileUploadErrors,
  useFileUploadList,
  useIsSubmitting,
} from "@open-system/core-data-access";
import {
  FileUploadProps,
  FileUpload as OsFileUpload,
  Skeleton,
} from "@open-system/design-system-components";
import { Atom } from "jotai";
import { Suspense, SuspenseList, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FileUploadItem } from "./file-upload-item";

export function FileUpload({
  label,
  name,
  required,
  disabled,
  multiple,
  minFiles,
  maxFiles,
  minSizeInBytes,
  maxSizeInBytes,
  allowedFiles,
  validator,
  ...props
}: FileUploadProps) {
  const { trigger } = useFormContext();
  const register = useFieldRegistration(name);
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  useFileUploadErrors({ field: name });

  const [field, setField] = useState<Partial<FormFieldConfig>>({
    type: "file",
  });
  useEffect(() => {
    const nextField = register({
      type: "file",
      multiple,
      minFiles,
      maxFiles,
      minSizeInBytes,
      maxSizeInBytes,
      allowedFiles,
      validator,
      required: required ? "This field is required." : undefined,
    });
    setField(nextField);
  }, [
    allowedFiles,
    maxFiles,
    maxSizeInBytes,
    minFiles,
    minSizeInBytes,
    multiple,
    name,
    register,
    required,
    validator,
  ]);

  useEffect(() => {
    trigger(name, { shouldFocus: false });
    // return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger]);

  const [fileAtoms, { include, exclude, reset }] = useFileUploadList({
    field: name,
  });

  return (
    <OsFileUpload
      name={name}
      {...props}
      maxSizeInBytes={maxSizeInBytes}
      minSizeInBytes={minSizeInBytes}
      multiple={multiple}
      maxFiles={maxFiles}
      minFiles={minFiles}
      allowedFiles={allowedFiles}
      validator={validator}
      label={label}
      value={value}
      {...field}
      required={required}
      onAddFiles={include}
      onResetFiles={reset}
      errors={errors}
      disabled={useIsSubmitting() || disabled}>
      {fileAtoms && fileAtoms.length > 0 && (
        <ul className="flex h-fit flex-col gap-1 p-4 pt-0">
          <SuspenseList revealOrder="forwards">
            {fileAtoms.map((fileAtom: Atom<Promise<FileUploadState>>) => (
              <Suspense
                key={`${fileAtom}`}
                fallback={
                  <Skeleton className="h-12 w-full rounded-lg border-2 border-primary" />
                }>
                <FileUploadItem fileAtom={fileAtom} onRemoveFile={exclude} />
              </Suspense>
            ))}
          </SuspenseList>
        </ul>
      )}
    </OsFileUpload>
  );
}
