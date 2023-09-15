/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata";

import { InitialServerContext } from "@open-system/core-server-application";
import { CloudflareServerBindings } from "@open-system/core-server-cloudflare/types";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "@open-system/core-server-graphql/context";
import { PinoLogger } from "@open-system/core-server-pino-logging";
import { Injector } from "@open-system/core-shared-injection/injector";
import { Logger } from "@open-system/core-shared-utilities/logging";
import { createServer } from "./server";

export interface Env extends CloudflareServerBindings {
  DB: any;
}

Injector.bind(Logger).to(PinoLogger);

export default {
  async fetch(
    request: Request,
    env: Env,
    context: Partial<
      GraphQLServerContext<InitialServerContext, GraphQLActiveServerContext>
    >
  ) {
    try {
      const server = await createServer();

      return server.fetch(request as any, env as any, context);
    } catch (e) {
      return new Response((e as Error)?.message, {
        status: 500,
        ...(e as Error)
      });
    }
  }
};
