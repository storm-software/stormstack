import {
  BaseErrorCode,
  StormError
} from "@stormstack/core-shared-utilities/errors";
import { R2Bucket, R2Object, R2ObjectBody } from "../types";

export async function setR2Async(
  name: string,
  data: string | any | ArrayBuffer | ArrayBufferView | Blob,
  r2Bucket: R2Bucket
): Promise<void> {
  await r2Bucket.put(name, data);
}

export async function getR2Async(
  name: string,
  r2Bucket: R2Bucket
): Promise<R2Object | R2ObjectBody> {
  const object = await r2Bucket.get(name);

  if (object === null) {
    throw new StormError(
      BaseErrorCode.record_not_found,
      `No items were found in ${name} bucket`
    );
  }

  /*const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);*/

  return object;
}

export async function removeR2Async(
  name: string,
  r2Bucket: R2Bucket
): Promise<void> {
  await r2Bucket.delete(name);
}
