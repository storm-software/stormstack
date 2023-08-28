import {
  BoolNullableFilter,
  DateTimeNullableFilter,
  NumberNullableFilter,
  StringNullableFilter,
  WhereParams
} from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain/types";
import { ConsoleLogger } from "@open-system/core-shared-utilities";
import {
  SQL,
  and,
  between,
  eq,
  gt,
  gte,
  inArray,
  like,
  lt,
  lte,
  ne,
  notBetween,
  notInArray
} from "drizzle-orm";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";

export const formatWhereParams = <
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
>(
  schema: SQLiteTableWithColumns<any>,
  where: WhereParams<TData, TKey>
): SQL => {
  return Object.entries(where)
    .filter(
      ([key, value]: [
        string,
        WhereParams<TData, TKey> | WhereParams<TData, TKey>[]
      ]) => key !== "AND" && key !== "OR" && key !== "NOT"
    )
    .reduce(
      (
        ret: SQL | undefined,
        [key, value]: [
          string,
          WhereParams<TData, TKey> | WhereParams<TData, TKey>[]
        ]
      ) => {
        // const filter = value as StringNullableFilter | DateTimeNullableFilter | BoolFilter;
        //Object.entries(filter)
        let sql: SQL | undefined;
        if (schema[key].column.dataType === "string") {
          const filter = value as StringNullableFilter;
          Object.entries(filter).reduce(
            (
              innerRet: SQL | undefined,
              [key, value]: [string, string | string[]]
            ) => {
              switch (key) {
                case "equals":
                  sql = eq(schema[key], value);
                  break;
                case "not":
                  sql = ne(schema[key], value);
                  break;
                case "lt":
                  sql = lt(schema[key], value);
                  break;
                case "lte":
                  sql = lte(schema[key], value);
                  break;
                case "gt":
                  sql = gt(schema[key], value);
                  break;
                case "gte":
                  sql = gte(schema[key], value);
                  break;
                case "in":
                  sql = inArray(
                    schema[key],
                    Array.isArray(value) ? value : [value]
                  );
                  break;
                case "notIn":
                  sql = notInArray(
                    schema[key],
                    Array.isArray(value) ? value : [value]
                  );
                  break;
                case "contains":
                  sql = like(schema[key], `%${value}%`);
                  break;
                case "startsWith":
                  sql = like(schema[key], `${value}%`);
                  break;
                case "endsWith":
                  sql = like(schema[key], `%${value}`);
                  break;
                default:
                  ConsoleLogger.warn("Unknown filter key: " + key);
                  return innerRet;
              }

              return and(innerRet, sql);
            },
            undefined
          );
        } else if (schema[key].column.dataType === "number") {
          const filter = value as NumberNullableFilter;
          Object.entries(filter).reduce(
            (
              innerRet: SQL | undefined,
              [key, value]: [string, number | number[]]
            ) => {
              switch (key) {
                case "equals":
                  sql = eq(schema[key], value);
                  break;
                case "not":
                  sql = ne(schema[key], value);
                  break;
                case "lt":
                  sql = lt(schema[key], value);
                  break;
                case "lte":
                  sql = lte(schema[key], value);
                  break;
                case "gt":
                  sql = gt(schema[key], value);
                  break;
                case "gte":
                  sql = gte(schema[key], value);
                  break;
                case "in":
                  sql = inArray(
                    schema[key],
                    Array.isArray(value) ? value : [value]
                  );
                  break;
                case "notIn":
                  sql = notInArray(
                    schema[key],
                    Array.isArray(value) ? value : [value]
                  );
                  break;
                case "between":
                  if (Array.isArray(value) && value.length >= 2) {
                    sql = between(schema[key], value[0], value[1]);
                  }
                  break;
                case "notBetween":
                  if (Array.isArray(value) && value.length >= 2) {
                    sql = notBetween(schema[key], value[0], value[1]);
                  }
                  break;
                default:
                  ConsoleLogger.warn("Unknown filter key: " + key);
                  return innerRet;
              }

              return and(innerRet, sql);
            },
            undefined
          );
        } else if (schema[key].column.dataType === "Date") {
          const filter = value as DateTimeNullableFilter;
          Object.entries(filter).reduce(
            (
              innerRet: SQL | undefined,
              [key, value]: [string, Date | Date[]]
            ) => {
              switch (key) {
                case "equals":
                  if (!Array.isArray(value)) {
                    sql = eq(schema[key], value.getMilliseconds());
                  }
                  break;
                case "not":
                  sql = ne(schema[key], value);
                  break;
                case "lt":
                  if (!Array.isArray(value)) {
                    sql = eq(schema[key], value.getMilliseconds());
                  }
                  break;
                case "lte":
                  if (!Array.isArray(value)) {
                    sql = lte(schema[key], value.getMilliseconds());
                  }
                  break;
                case "gt":
                  if (!Array.isArray(value)) {
                    sql = gt(schema[key], value.getMilliseconds());
                  }
                  break;
                case "gte":
                  if (!Array.isArray(value)) {
                    sql = gte(schema[key], value.getMilliseconds());
                  }
                  break;
                case "in":
                  sql = inArray(
                    schema[key],
                    Array.isArray(value)
                      ? value.map(d => d.getMilliseconds())
                      : [value.getMilliseconds()]
                  );
                  break;
                case "notIn":
                  sql = notInArray(
                    schema[key],
                    Array.isArray(value)
                      ? value.map(d => d.getMilliseconds())
                      : [value.getMilliseconds()]
                  );
                  break;
                case "between":
                  if (Array.isArray(value) && value.length >= 2) {
                    sql = between(
                      schema[key],
                      value[0].getMilliseconds(),
                      value[1].getMilliseconds()
                    );
                  }
                  break;
                case "notBetween":
                  if (Array.isArray(value) && value.length >= 2) {
                    sql = notBetween(
                      schema[key],
                      value[0].getMilliseconds(),
                      value[1].getMilliseconds()
                    );
                  }
                  break;
                default:
                  ConsoleLogger.warn("Unknown filter key: " + key);
                  return innerRet;
              }

              return and(innerRet, sql);
            },
            undefined
          );
        } else if (schema[key].column.dataType === "boolean") {
          const filter = value as BoolNullableFilter;
          Object.entries(filter).reduce(
            (
              innerRet: SQL | undefined,
              [key, value]: [string, boolean | boolean[]]
            ) => {
              switch (key) {
                case "equals":
                  sql = eq(schema[key], value);
                  break;
                case "not":
                  sql = ne(schema[key], value);
                  break;
                default:
                  ConsoleLogger.warn("Unknown filter key: " + key);
                  return innerRet;
              }

              return and(innerRet, sql);
            },
            undefined
          );
        }

        return and(ret, sql);
      },
      undefined
    );
};