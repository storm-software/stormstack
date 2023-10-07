import { HeaderTypes, MediaTypes } from "@stormstack/core-shared-api";
import {
  JsonParser,
  JsonValue,
  QueryParamsParser
} from "@stormstack/core-shared-serialization";
import {
  BaseError,
  isNotEmpty,
  isString
} from "@stormstack/core-shared-utilities";
import {
  ApiClientRequest,
  ApiClientResult,
  ApiClientResultStatus
} from "../types";

export const SERIALIZABLE_MEDIA_TYPES = [
  MediaTypes.JSON,
  MediaTypes.PROBLEM_JSON,
  MediaTypes.GRAPHQL_RESPONSE_JSON
];

export function serializeRequest(options: ApiClientRequest): ApiClientRequest {
  if (isNotEmpty(options.queryParams)) {
    options.url = new URL(
      `${options.url.toString()}${QueryParamsParser.stringify(
        options.queryParams
      )}`
    );
  }

  if (
    options.headers[HeaderTypes.CONTENT_TYPE] &&
    SERIALIZABLE_MEDIA_TYPES.includes(options.headers[HeaderTypes.CONTENT_TYPE])
  ) {
    options.body = JsonParser.stringify(options.body as JsonValue);
  }

  return options;
}

export function deserializeResult<
  TData = any,
  TError extends BaseError = BaseError
>(response: ApiClientResult<string>): ApiClientResult<TData, TError> {
  let data: TData | undefined;
  let error: TError | undefined;

  let parsed: TData | TError | undefined;
  if (response.data && isString(response.data)) {
    parsed = JsonParser.parse<TData | TError>(response.data);
  }

  if (BaseError.isBaseError(parsed)) {
    error = parsed as TError;
  } else {
    data = parsed as TData;
  }

  return {
    ...response,
    data,
    error,
    status: error ? ApiClientResultStatus.ERROR : ApiClientResultStatus.SUCCESS,
    code: error?.code
  };
}
