import { BINDINGS_TOKEN } from "@stormstack/core-server-application";
import {
  ExecutionContext,
  ServerContext
} from "@stormstack/core-server-application/context/execution-context";
import { GlobalContext } from "@stormstack/core-server-application/context/global-context";
import { isDrizzleSqliteDB } from "@stormstack/core-server-drizzle/utilities";
import { Injector } from "@stormstack/core-shared-injection/injector";
import { isSet } from "@stormstack/core-shared-utilities/common/type-checks";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import {
  CloudflareServerBindings,
  CloudflareServerBindingsContext
} from "../types";

export const extendCloudflareServerContext = <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends ExecutionContext = ExecutionContext
>(
  context: ServerContext<TGlobalContext, TExecutionContext>,
  executionContext: TExecutionContext
): ServerContext<TGlobalContext, TExecutionContext> => {
  const requestBindings = executionContext.bindings as CloudflareServerBindings;

  let database: DrizzleD1Database<Record<string, unknown>> | undefined;
  if (isDrizzleSqliteDB(requestBindings?.DB)) {
    // database = requestBindings.DB;
  } else if (isSet(requestBindings?.DB)) {
    database = drizzle(requestBindings?.DB);
  } else {
    context.utils.logger.warn("No database found in Cloudflare bindings.");
  }

  context.bindings = {
    env: requestBindings,
    database
  };

  Injector.bindConstant<CloudflareServerBindingsContext>(
    BINDINGS_TOKEN,
    context.bindings
  );

  return context;
};
