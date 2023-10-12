export const MAX_ATTACHMENT_SIZE = 50000000;

export const MAX_ATTACHMENTS_COUNT = 10;

export type MediaTypes =
  | "application/json"
  | "application/xml"
  | "application/problem+json"
  | "application/problem+xml"
  | "application/octet-stream"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain"
  | "text/html"
  | "application/graphql-response+json";
export const MediaTypes = {
  JSON: "application/json" as MediaTypes,
  XML: "application/xml" as MediaTypes,
  PROBLEM_JSON: "application/problem+json" as MediaTypes,
  PROBLEM_XML: "application/problem+xml" as MediaTypes,
  OCTET_STREAM: "application/octet-stream" as MediaTypes,
  MOZ_FILE: "application/x-moz-file" as MediaTypes,
  FORM_URLENCODED: "application/x-www-form-urlencoded" as MediaTypes,
  FORM_DATA: "multipart/form-data" as MediaTypes,
  TEXT_PLAIN: "text/plain" as MediaTypes,
  HTML: "text/html" as MediaTypes,
  GRAPHQL_RESPONSE_JSON: "application/graphql-response+json" as MediaTypes
};

export type FileValidationConfig = {
  multiple: boolean;
  minFiles: number;
  maxFiles: number;
  minSizeInBytes: number;
  maxSizeInBytes: number;
  allowedFiles: string[];
};

export type FileUploadState = {
  field: string;
  formId: string;
  dataUrl?: string;
  data?: string;
  file: File;
  fileName: string;
  originalFileName: string;
  errors?: string[];
};
