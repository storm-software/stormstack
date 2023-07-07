import { ApiException } from "../errors/api-exception";
import { ServerResult } from "../types";
import { isCodeInRange } from "./http-fns";

export const validateServerResult = (
  response: ServerResult<unknown>
): boolean => {
  const { status, message } = response;

  if (!isCodeInRange("200", status)) {
    if (isCodeInRange("401", status)) {
      throw new ApiException<string>(status, "Unauthorized", message);
    }
    if (isCodeInRange("404", status)) {
      throw new ApiException<string>(status, "Not Found", message);
    }
    if (isCodeInRange("500", status)) {
      throw new ApiException<string>(status, "Internal Server Error", message);
    }
    if (isCodeInRange("503", status)) {
      throw new ApiException<string>(status, "Service Unavailable", message);
    }

    throw new ApiException<string | Blob | undefined>(
      status,
      "Server Error",
      message
    );
  }

  return true;
};
