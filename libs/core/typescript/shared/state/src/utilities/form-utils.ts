import accepts from "attr-accept";
import { FileValidationConfig, MediaTypes } from "../types";

/**
 * Firefox versions prior to S3 return a bogus MIME type for every file drag, so dragovers with
 * that MIME type will always be accepted
 */
function fileAccepted(file: File, accept: string[]) {
  const isAcceptable =
    file.type === MediaTypes.MOZ_FILE || accepts(file, accept);
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
    allowedFiles
  }: FileValidationConfig
): Record<string, string[]> => {
  const result = files.reduce(
    (errors: Record<string, string[]>, file: File, i: number) => {
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

      errors[file.name] = failures;
      return errors;
    },
    {}
  );

  if (files.length < minFiles) {
    Object.keys(result).forEach((key: string) =>
      result[key].push("Too few files have been selected")
    );
  }

  return result;
};
