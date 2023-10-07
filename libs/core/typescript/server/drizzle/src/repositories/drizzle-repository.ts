/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  FindCountParams,
  FindManyParams,
  FindUniqueParams,
  Repository,
  ServerContext,
  UpdateManyParams,
  UpdateParams,
  UpsertParams
} from "@stormstack/core-server-application";
import { IEntity } from "@stormstack/core-server-domain";
import { Provider } from "@stormstack/core-shared-injection";
import { BaseError, BaseErrorCode } from "@stormstack/core-shared-utilities";
import { sql } from "drizzle-orm";
import {
  BaseSQLiteDatabase,
  SQLiteTableWithColumns
} from "drizzle-orm/sqlite-core";
import { BindingsWithDatabase } from "../types";
import { formatWhereParams } from "../utilities/format-params";

@Provider(DrizzleRepository)
export abstract class DrizzleRepository<
  TEntity extends IEntity = IEntity
> extends Repository<TEntity> {
  protected abstract schema: SQLiteTableWithColumns<any>;
  protected bindings!: BindingsWithDatabase<TEntity, typeof this.schema>;

  protected get db(): BaseSQLiteDatabase<"async", TEntity, typeof this.schema> {
    return this.bindings.database;
  }

  constructor(context: ServerContext) {
    super(context.utils.logger, context.env);

    this.bindings = context.bindings as BindingsWithDatabase<
      TEntity,
      typeof this.schema
    >;
  }

  protected override innerFindUnique = async (
    params: FindUniqueParams<TEntity>
  ) => {
    const results = await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TEntity>(this.schema, params.where));
    if (!results || results.length === 0) {
      throw new BaseError(
        BaseErrorCode.record_not_found,
        `No records were found`
      );
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
      throw new BaseError(
        BaseErrorCode.record_not_found,
        `No records were found`
      );
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
      throw new BaseError(
        BaseErrorCode.record_not_found,
        `No records were found`
      );
    }

    return results[0].count;
  };

  protected override innerCreate = async (params: CreateParams<TEntity>) => {
    const result = await this.db.insert(this.schema).values(params.data);

    return result.id;
  };

  protected override innerDelete = async (params: DeleteParams<TEntity>) => {
    const result = await (this.db.delete(this.schema) as any).where(
      formatWhereParams<TEntity>(this.schema, params.where)
    );

    return result.id;
  };

  protected override innerDeleteMany = async (
    params: DeleteManyParams<TEntity>
  ) => {
    const result = await (this.db.delete(this.schema) as any).where(
      formatWhereParams<TEntity>(this.schema, params.where)
    );

    return [result.id];
  };

  protected override innerUpdate = async (params: UpdateParams<TEntity>) => {
    const result = await this.db
      .update(this.schema)
      .set(params.data)
      .where(formatWhereParams<TEntity>(this.schema, params.where));

    return result.id;
  };

  protected override innerUpdateMany = async (
    params: UpdateManyParams<TEntity>
  ) => {
    const result = await this.db
      .update(this.schema)
      .set(params.data)
      .where(formatWhereParams<TEntity>(this.schema, params.where));

    return [result.id];
  };

  protected override innerUpsert = async (params: UpsertParams<TEntity>) => {
    let result;
    if (params.update) {
      result = await this.db
        .update(this.schema)
        .set(params.update)
        .where(formatWhereParams<TEntity>(this.schema, params.where));
    } else if (params.create) {
      result = await this.db.insert(this.schema).values(params.create);
    } else {
      throw new BaseError(
        BaseErrorCode.required_field_missing,
        "No update or create data provided"
      );
    }

    return result;
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
