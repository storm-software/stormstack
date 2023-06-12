"use client";

import { useFileUploadList } from "@open-system/core-data-access";
import {
  FileUploadProps,
  FileUploadItem,
  FileUpload as OsFileUpload,
} from "@open-system/design-system-components";
import { useEffect } from "react";
import { UseFormRegisterReturn, useFormContext } from "react-hook-form";
import { useFieldErrors } from "../hooks/useFieldErrors";
import { useFieldValue } from "../hooks/useFieldValue";
import { useIsSubmitting } from "../hooks/useIsSubmitting";

export function FileUpload({
  label,
  name,
  required,
  disabled,
  ...props
}: FileUploadProps) {
  const { register, unregister, trigger } = useFormContext();
  const errors = useFieldErrors(name);
  const value = useFieldValue(name);

  const field = (register?.(name, {
    required: required ? "This field is required." : undefined,
  }) ?? {}) as UseFormRegisterReturn<string>;

  useEffect(() => {
    trigger();
    return () => unregister?.(name, { keepIsValid: false });
  }, [name, trigger, unregister]);

  const [files, { include, exclude, reset }] = useFileUploadList({
    field: name,
  });

  return (
    <OsFileUpload
      {...props}
      {...field}
      label={label}
      value={value}
      files={files}
      onInclude={include}
      onExclude={exclude}
      onReset={reset}
      errors={errors as Record<string, string>}
      disabled={useIsSubmitting() || disabled}
    >{files && files.length > 0 && (
    <ul className="flex h-fit flex-col gap-1 p-4 pt-0">
        <>
          {files.map((file: FileState) => (
            <FileUploadItem
              key={file.fileId}
              file={file}
              onExclude={exclude}
            />
          ))}
        </>
   
    </ul>
       )}
    </OsFileUpload>
  );
}
