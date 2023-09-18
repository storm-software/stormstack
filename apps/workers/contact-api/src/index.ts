/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata";
import "./dependencies";

import { ConsoleLogger } from "@open-system/core-shared-logging/console/console-logger";
import { formatErrorLog } from "@open-system/core-shared-logging/format/format-log";
import { isError } from "@open-system/core-shared-utilities/common/type-checks";
import { createServer } from "./server";

export interface Env {
  DB: any;
}

export default {
  async fetch(request: Request, env: Env) {
    try {
      ConsoleLogger.debug("Server bindings", env);

      const server = await createServer();

      const result = await server.fetch(request as any, env as any);
      if (isError(result)) {
        ConsoleLogger.error(result);
        return new Response(formatErrorLog(result), {
          status: 500,
          ...(result as Error)
        });
      }

      return result;
    } catch (e) {
      ConsoleLogger.fatal(e);
      return new Response(formatErrorLog(e as Error), {
        status: 500,
        ...(e as Error)
      });
    }
  }
};
