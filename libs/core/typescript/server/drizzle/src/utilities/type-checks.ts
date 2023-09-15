import { IEntity } from "@open-system/core-server-domain/types";
import { isObject, isSet } from "@open-system/core-shared-utilities";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

/**
 * Check if the provided value's type is `DrizzleD1Database`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `DrizzleD1Database`
 */
export const isDrizzleSqliteDB = <
  TEntity extends IEntity = IEntity,
  TSchema extends TEntity & Record<string, unknown> = TEntity &
    Record<string, unknown>
>(
  obj: unknown
): obj is BaseSQLiteDatabase<"async", TEntity, TSchema> => {
  try {
    return (
      isSet(obj) &&
      isObject(obj) &&
      isSet((obj as DrizzleD1Database)?._?.tableNamesMap) &&
      isObject((obj as DrizzleD1Database)?._?.tableNamesMap)
    );
  } catch (e) {
    return false;
  }
};
