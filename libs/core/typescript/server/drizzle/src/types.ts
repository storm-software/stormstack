/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@stormstack/core-server-domain/types";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

export type BindingsWithDatabase<
  TEntity extends IEntity = IEntity,
  TSchema extends TEntity & Record<string, unknown> = TEntity &
    Record<string, unknown>
> = {
  database: BaseSQLiteDatabase<"async", TEntity, TSchema>;
};
