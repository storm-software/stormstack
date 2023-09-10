import { UserContext } from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLServerContext } from "@open-system/core-server-graphql";
import { Headers } from "@open-system/core-shared-utilities";

export interface BaseCloudflareEnv {
  USERNAME: string;
  PASSWORD: string;
}

/*export type CloudflareSingleFileRequest = Request<{
  file: any;
}>;

export type CloudflareMultiFileRequest = Request<{
  name: string;
  file: any;
}>;
*/

export interface R2Error extends Error {
  readonly name: string;
  readonly code: number;
  readonly message: string;
  readonly action: string;
  readonly stack: any;
}

export interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
  startAfter?: string;
}

export interface R2Bucket {
  head: (key: string) => Promise<R2Object | null>;
  get: (
    key: string,
    options?: R2GetOptions & {
      onlyIf: R2Conditional | Headers;
    }
  ) => Promise<R2ObjectBody | R2Object | null>;
  put: (
    key: string,
    value: any | ArrayBuffer | ArrayBufferView | string | null | Blob,
    options?: R2PutOptions
  ) => Promise<R2Object>;
  createMultipartUpload: (
    key: string,
    options?: R2MultipartOptions
  ) => Promise<R2MultipartUpload>;
  resumeMultipartUpload: (key: string, uploadId: string) => R2MultipartUpload;
  delete: (keys: string | string[]) => Promise<void>;
  list: (options?: R2ListOptions) => Promise<R2Objects>;
}

export interface R2MultipartUpload {
  readonly key: string;
  readonly uploadId: string;
  uploadPart: (
    partNumber: number,
    value: any | (ArrayBuffer | ArrayBufferView) | string | Blob
  ) => Promise<R2UploadedPart>;
  abort: () => Promise<void>;
  complete: (uploadedParts: R2UploadedPart[]) => Promise<R2Object>;
}

export interface R2UploadedPart {
  partNumber: number;
  etag: string;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  checksums: R2Checksums;
  uploaded: Date;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  range?: R2Range;
  writeHttpMetadata: (headers: Headers) => void;
}

export interface R2ObjectBody extends R2Object {
  get body(): any;
  get bodyUsed(): boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T>(): Promise<T>;
  blob(): Promise<Blob>;
}

export type R2Range =
  | {
      offset: number;
      length?: number;
    }
  | {
      offset?: number;
      length: number;
    }
  | {
      suffix: number;
    };

export interface R2Conditional {
  etagMatches?: string;
  etagDoesNotMatch?: string;
  uploadedBefore?: Date;
  uploadedAfter?: Date;
  secondsGranularity?: boolean;
}

export interface R2GetOptions {
  onlyIf?: R2Conditional | Headers;
  range?: R2Range | Headers;
}

export interface R2PutOptions {
  onlyIf?: R2Conditional | Headers;
  httpMetadata?: R2HTTPMetadata | Headers;
  customMetadata?: Record<string, string>;
  md5?: ArrayBuffer | string;
  sha1?: ArrayBuffer | string;
  sha256?: ArrayBuffer | string;
  sha384?: ArrayBuffer | string;
  sha512?: ArrayBuffer | string;
}

export interface R2MultipartOptions {
  httpMetadata?: R2HTTPMetadata | Headers;
  customMetadata?: Record<string, string>;
}

export interface R2Checksums {
  readonly md5?: ArrayBuffer;
  readonly sha1?: ArrayBuffer;
  readonly sha256?: ArrayBuffer;
  readonly sha384?: ArrayBuffer;
  readonly sha512?: ArrayBuffer;
  toJSON: () => R2StringChecksums;
}

export interface R2StringChecksums {
  md5?: string;
  sha1?: string;
  sha256?: string;
  sha384?: string;
  sha512?: string;
}

export interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export type R2Objects = {
  objects: R2Object[];
  delimitedPrefixes: string[];
} & (
  | {
      truncated: true;
      cursor: string;
    }
  | {
      truncated: false;
    }
);

export type CloudflareApiServerContext<
  TEntities extends IEntity[] = IEntity[],
  TUser extends UserContext = UserContext
> = GraphQLServerContext<TEntities, TUser>;
