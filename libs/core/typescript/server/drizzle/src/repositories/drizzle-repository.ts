/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  FindCountParams,
  FindManyParams,
  FindUniqueParams,
  Repository,
  UpdateManyParams,
  UpdateParams,
  UpsertParams
} from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain";
import { EnvManager } from "@open-system/core-shared-env/env-manager";
import { BaseOptions } from "@open-system/core-shared-env/types";
import { Provider } from "@open-system/core-shared-injection";
import {
  Logger,
  NotFoundError,
  RequiredError
} from "@open-system/core-shared-utilities";
import { sql } from "drizzle-orm";
import {
  BaseSQLiteDatabase,
  SQLiteTableWithColumns
} from "drizzle-orm/sqlite-core";
import { formatWhereParams } from "../utilities/format-params";

@Provider(DrizzleRepository)
export abstract class DrizzleRepository<
  TEntity extends IEntity = IEntity
> extends Repository<TEntity> {
  protected abstract schema: SQLiteTableWithColumns<any>;

  constructor(
    protected db: BaseSQLiteDatabase<"async", any, any>,
    logger: Logger,
    env: EnvManager<BaseOptions>
  ) {
    super(logger, env);
  }

  protected override innerFindUnique = async (
    params: FindUniqueParams<TEntity>
  ) => {
    const results = await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
    if (!results || results.length === 0) {
      throw new NotFoundError("records");
    }

    return results[0] as TEntity;
  };

  /*protected override innerFindFirst = async (
    params: FindFirstParams<TEntity>
  ) => {
    const results = await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
    if (!results || results.length === 0) {
      throw new NotFoundError("records");
    }

    return results[0] as TEntity;
  };*/

  protected override innerFindMany = async (
    params: FindManyParams<TEntity>
  ) => {
    const results = await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
    if (!results || results.length === 0) {
      throw new NotFoundError("records");
    }

    return results as TEntity[];
  };

  protected override innerFindCount = async (
    params: FindCountParams<TEntity>
  ) => {
    const results = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.schema)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
    if (!results || results.length === 0) {
      throw new NotFoundError("records");
    }

    return results[0].count;
  };

  protected override innerCreate = async (params: CreateParams<TEntity>) => {
    return this.db.insert(this.schema).values(params.data);
  };

  protected override innerDelete = async (params: DeleteParams<TEntity>) => {
    return this.db
      .delete(this.schema)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
  };

  protected override innerDeleteMany = async (
    params: DeleteManyParams<TEntity>
  ) => {
    return this.db
      .delete(this.schema)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
  };

  protected override innerUpdate = async (params: UpdateParams<TEntity>) => {
    return this.db
      .update(this.schema)
      .set(params.data)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
  };

  protected override innerUpdateMany = async (
    params: UpdateManyParams<TEntity>
  ) => {
    return this.db
      .update(this.schema)
      .set(params.data)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
  };

  protected override innerUpsert = async (params: UpsertParams<TEntity>) => {
    if (params.update) {
      return this.db
        .update(this.schema)
        .set(params.update)
        .where(formatWhereParams<TEntity>(this.schema, params.where));
    } else if (params.create) {
      return this.db.insert(this.schema).values(params.create);
    } else {
      throw new RequiredError("No update or create data provided");
    }
  };

  /*protected override innerAggregate = async (
    params: AggregateParams<TEntity>
  ) => {
    return (await this.db
      .select()
      .from(this.schema)
      .where(
        formatWhereParams<TEntity>(this.schema, params.where)
      )) as TEntity[];
  };

  protected override innerGroupBy = async (params: GroupByParams<TEntity>) => {
    return (await this.db
      .select()
      .from(this.schema)
      .where(
        formatWhereParams<TEntity>(this.schema, params.where)
      )) as TEntity[];
  };*/
}
