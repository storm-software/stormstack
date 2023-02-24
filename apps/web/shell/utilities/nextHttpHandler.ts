/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ConsoleLogger,
  DateTime,
  HttpHandlerReturn,
  RequestContext,
  ResponseContext,
} from "@open-system/core-typescript-utilities";

export const nextHttpHandler =
  ({ baseUrl }: { baseUrl: string }) =>
  async (
    request: RequestContext,
    extraOptions?: any
  ): Promise<HttpHandlerReturn> => {
    const timestamp = DateTime.current;

    const url = request.getUrl(baseUrl, undefined, extraOptions);

    ConsoleLogger.debug(`Sending request to ${url}`);

    const response = await fetch(
      url,
      request.getRequestOptions(undefined, extraOptions)
    );

    ConsoleLogger.debug(
      `Received response status code: ${response.status} (${url})`
    );

    const headers: { [name: string]: string } = {};
    response.headers.forEach((value: string, name: string) => {
      headers[name] = value;
    });

    return {
      data: ResponseContext.create(
        response.status,
        headers,
        {
          text: () => response.text(),
          binary: () => response.blob(),
        },
        response.statusText
      ),
      meta: {
        request,
        type: response.type,
        timestamp,
        extraOptions,
      },
    };
  };
