import {
  ApiClientResult,
  ApiClientResultStatus,
  ApiErrorCode,
  HeaderTypes
} from "@stormstack/core-shared-api";
import {
  JsonParser,
  JsonValue,
  QueryParamsParser
} from "@stormstack/core-shared-serialization";
import { MediaTypes } from "@stormstack/core-shared-state";
import {
  FieldError,
  StormError,
  isNotEmpty,
  isString
} from "@stormstack/core-shared-utilities";
import { ApiClientRequest } from "../types";

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
  TError extends StormError = StormError
>(response: ApiClientResult<string>): ApiClientResult<TData, TError> {
  let data: TData | undefined;
  let error: TError | undefined;

  if (
    response.status === ApiClientResultStatus.SUCCESS &&
    !response.data &&
    !response.error
  ) {
    throw new StormError(
      ApiErrorCode.no_response_from_server,
      "Could not read the response from the server"
    );
  }

  let parsed: TData | TError | undefined;
  if (response.data && isString(response.data)) {
    parsed = JsonParser.parse<TData | TError>(response.data);
  }

  if (StormError.isBaseError(parsed) || Array.isArray(parsed)) {
    if (Array.isArray(parsed)) {
      error = parsed.reduce((ret: StormError, e: any) => {
        if (StormError.isBaseError(e)) {
          if (FieldError.isFieldError(e)) {
            ret.addFieldError(e);
          } else {
            ret.addIssue(e);
          }

          return ret;
        }
      }, new StormError(ApiErrorCode.internal_server_error));
    } else {
      error = parsed as TError;
    }
  } else {
    data = parsed as TData;
  }

  return {
    ...response,
    status: error ? ApiClientResultStatus.ERROR : ApiClientResultStatus.SUCCESS,
    data,
    error
  };
}
