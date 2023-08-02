import {
  ApiException,
  ConsoleLogger,
} from "@open-system/core-shared-utilities";
import { RequestOptions } from "http";
import { KsqlDBRest } from "../types";

export const runCommand = async (
  ksqlCommand: string,
  options: RequestOptions
): Promise<KsqlDBRest> => {
  const url = `${options.protocol ?? "https"}://${options.host}:${
    options.port
  }/ksql`;
  ConsoleLogger.info(`Sending request to ${url} end point.`);

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      ksql: ksqlCommand,
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${btoa(options.auth)}`,
    },
  });
  if (!response.ok) {
    throw new ApiException(
      response.status,
      response.statusText,
      await response.json(),
      response.headers as any
    );
  }

  const data = await response.json();
  ConsoleLogger.info(data);

  return { statusCode: response.status, data };
};
