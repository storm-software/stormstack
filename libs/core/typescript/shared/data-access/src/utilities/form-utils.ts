import accepts from "attr-accept";
import { FileFormFieldConfig } from "../types";

export const isFormFieldEqual = (
  field1: { field: string; formId: string },
  field2: { field: string; formId: string }
) => field1.field === field2.field && field1.formId === field2.formId;

/**
 * Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
 * that MIME type will always be accepted
 */
function fileAccepted(file: File, accept: string[]) {
  const isAcceptable =
    file.type === "application/x-moz-file" || accepts(file, accept);
  return isAcceptable;
}

export const checkFileUploadValidations = (
  files: File[],
  fileCount = 0,
  {
    minFiles,
    maxFiles,
    minSizeInBytes,
    maxSizeInBytes,
    multiple,
    allowedFiles,
    validator,
  }: FileFormFieldConfig
): Record<string, string[]> =>
  files.reduce((errors: Record<string, string[]>, file: File, i: number) => {
    const failures = [];
    if (fileCount + i > maxFiles || (!multiple && fileCount + i > 1)) {
      failures.push("Exceeded the maximum number of files uploads");
    }
    if (file.size < minSizeInBytes) {
      failures.push("File is too small to be included");
    }
    if (file.size > maxSizeInBytes) {
      failures.push("File is too large to be included");
    }
    if (!fileAccepted(file, allowedFiles)) {
      failures.push("File type is not allowed");
    }
    if (validator) {
      failures.push(...validator(file));
    }

    errors[file.name] = failures;
    return errors;
  }, {});
