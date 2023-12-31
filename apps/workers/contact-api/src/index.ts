/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata";
import "./dependencies";

import { extendContactServerContext } from "@stormstack/contact-server-attachment";
import { schema } from "@stormstack/contact-server-attachment/api";
import { handleCloudflareGraphQLRequest } from "@stormstack/core-server-cloudflare/server/handler";
import { isPonyfillBody } from "@stormstack/core-server-utilities/type-checks";
import {
  HeaderTypes,
  HttpMethods,
  MediaTypes
} from "@stormstack/core-shared-api/types";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console/console-logger";
import { formatErrorLog } from "@stormstack/core-shared-logging/format/format-log";

export interface Env {
  DB: any;
}

globalThis.Buffer = Buffer;
globalThis.TransformStream = TransformStream;
globalThis.ReadableStream = ReadableStream;
globalThis.WritableStream = WritableStream;

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

      const headers: HeadersInit = response.headers;
      let contentType!: string;

      if (isPonyfillBody(response)) {
        contentType = response.contentType;
        headers.set(HeaderTypes.CONTENT_TYPE, response.contentType);
      } else if (headers.has(HeaderTypes.CONTENT_TYPE)) {
        contentType = headers.get(HeaderTypes.CONTENT_TYPE)!;
      }

      return new Response(
        contentType === MediaTypes.TEXT_PLAIN ||
        contentType === MediaTypes.HTML ||
        request.method === HttpMethods.GET
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
