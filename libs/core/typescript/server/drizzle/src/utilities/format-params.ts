/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BoolNullableFilter,
  DateTimeNullableFilter,
  NumberNullableFilter,
  StringNullableFilter,
  WhereParams
} from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { ConsoleLogger } from "@open-system/core-shared-logging/console";
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

export const formatWhereParams = <TEntity extends IEntity = IEntity>(
  schema: SQLiteTableWithColumns<any>,
  where: WhereParams<TEntity>
): SQL<any> => {
  return Object.entries(where)
    .filter(
      ([key]: [string, WhereParams<TEntity> | WhereParams<TEntity>[]]) =>
        key !== "AND" && key !== "OR" && key !== "NOT"
    )
    .reduce(
      (
        ret: SQL<any>,
        [key, value]: [string, WhereParams<TEntity> | WhereParams<TEntity>[]]
      ) => {
        // const filter = value as StringNullableFilter | DateTimeNullableFilter | BoolFilter;
        //Object.entries(filter)
        let sql: SQL<any> = new SQL([]);
        if (schema[key].column.dataType === "string") {
          const filter = value as StringNullableFilter;
          sql = Object.entries(filter).reduce(
            (innerRet: SQL<any>, [key, value]: [string, string | string[]]) => {
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
            new SQL([])
          );
        } else if (schema[key].column.dataType === "number") {
          const filter = value as NumberNullableFilter;
          sql = Object.entries(filter).reduce(
            (innerRet: SQL<any>, [key, value]: [string, number | number[]]) => {
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
            new SQL([])
          );
        } else if (schema[key].column.dataType === "Date") {
          const filter = value as DateTimeNullableFilter;
          sql = Object.entries(filter).reduce(
            (
              innerRet: SQL<any>,
              [key, value]: [string, string | Date | string[] | Date[] | null]
            ) => {
              if (!value) {
                return innerRet;
              }

              switch (key) {
                case "equals":
                  if (!Array.isArray(value)) {
                    sql = eq(schema[key], new Date(value).getMilliseconds());
                  }
                  break;
                case "not":
                  sql = ne(schema[key], value);
                  break;
                case "lt":
                  if (!Array.isArray(value)) {
                    sql = eq(schema[key], new Date(value).getMilliseconds());
                  }
                  break;
                case "lte":
                  if (!Array.isArray(value)) {
                    sql = lte(schema[key], new Date(value).getMilliseconds());
                  }
                  break;
                case "gt":
                  if (!Array.isArray(value)) {
                    sql = gt(schema[key], new Date(value).getMilliseconds());
                  }
                  break;
                case "gte":
                  if (!Array.isArray(value)) {
                    sql = gte(schema[key], new Date(value).getMilliseconds());
                  }
                  break;
                case "in":
                  sql = inArray(
                    schema[key],
                    Array.isArray(value)
                      ? value.map(d => d.getMilliseconds())
                      : [new Date(value).getMilliseconds()]
                  );
                  break;
                case "notIn":
                  sql = notInArray(
                    schema[key],
                    Array.isArray(value)
                      ? value.map(d => d.getMilliseconds())
                      : [new Date(value).getMilliseconds()]
                  );
                  break;
                case "between":
                  if (Array.isArray(value) && value.length >= 2) {
                    sql = between(
                      schema[key],
                      new Date(value[0]).getMilliseconds(),
                      new Date(value[1]).getMilliseconds()
                    );
                  }
                  break;
                case "notBetween":
                  if (Array.isArray(value) && value.length >= 2) {
                    sql = notBetween(
                      schema[key],
                      new Date(value[0]).getMilliseconds(),
                      new Date(value[1]).getMilliseconds()
                    );
                  }
                  break;
                default:
                  ConsoleLogger.warn("Unknown filter key: " + key);
                  return innerRet;
              }

              return and(innerRet, sql);
            },
            new SQL([])
          );
        } else if (schema[key].column.dataType === "boolean") {
          const filter = value as BoolNullableFilter;
          sql = Object.entries(filter).reduce(
            (
              innerRet: SQL<any>,
              [key, value]: [string, boolean | boolean[] | null]
            ) => {
              if (!value) {
                return innerRet;
              }

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
            new SQL([])
          );
        }

        return and(ret, sql);
      },
      new SQL([])
    );
};
