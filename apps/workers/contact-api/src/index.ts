/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata";
import "./dependencies";

import { extendContactServerContext } from "@open-system/contact-server-attachment";
import { schema } from "@open-system/contact-server-attachment/api";
import { handleCloudflareGraphQLRequest } from "@open-system/core-server-cloudflare/server/handler";
import { isPonyfillBody } from "@open-system/core-server-utilities/type-checks";
import { ConsoleLogger } from "@open-system/core-shared-logging/console/console-logger";
import { formatErrorLog } from "@open-system/core-shared-logging/format/format-log";
import {
  HttpHeaderTypes,
  HttpMediaTypes,
  HttpMethod
} from "@open-system/core-shared-utilities/types";

export interface Env {
  DB: any;
}

globalThis.Buffer = Buffer;
globalThis.TransformStream = TransformStream;
globalThis.ReadableStream = ReadableStream;
globalThis.WritableStream = WritableStream;

/*addEventListener("unhandledrejection", (event) => {
  ConsoleLogger.error(globalContextStore.getStore(), "unhandled rejection!");
  ConsoleLogger.error(event);
});*/

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const response = await handleCloudflareGraphQLRequest(
        request,
        {
          schema,
          serviceProvidersOptions: {
            services: []
          },
          extendContextOptions: {
            plugin: extendContactServerContext
          }
        },
        env
      );

      /*let { readable, writable } = new TransformStream();
      response.body.pipeTo(writable);*/

      const headers: HeadersInit = response.headers;
      let contentType!: string;

      if (isPonyfillBody(response)) {
        contentType = response.contentType;
        headers.set(HttpHeaderTypes.CONTENT_TYPE, response.contentType);
      } else if (headers.has(HttpHeaderTypes.CONTENT_TYPE)) {
        contentType = headers.get(HttpHeaderTypes.CONTENT_TYPE)!;
      }

      return new Response(
        contentType === HttpMediaTypes.TEXT ||
        contentType === HttpMediaTypes.HTML ||
        request.method === HttpMethod.GET
          ? await response.text()
          : await response.json(),
        {
          status: response.status,
          statusText: response.statusText,
          headers
        }
      );
    } catch (e) {
      ConsoleLogger.fatal(e);
      return new Response(formatErrorLog(e as Error), {
        status: 500,
        ...(e as Error)
      });
    }
  }
};
