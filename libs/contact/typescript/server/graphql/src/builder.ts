/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSchemaBuilder } from "@open-system/core-server-graphql";
import { PrismaClient } from "./__generated__/prisma";
import PrismaTypes from "./__generated__/types";
import { ContactApiServerContext } from "./types";

export const client = new PrismaClient({
  log: ["error", "info", "query", "warn"],
});

export const builder = createSchemaBuilder<
  PrismaTypes,
  ContactApiServerContext
>(client);
