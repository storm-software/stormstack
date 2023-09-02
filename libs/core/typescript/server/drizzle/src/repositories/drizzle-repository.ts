import {
  AggregateParams,
  BatchLoadFn,
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  FindFirstParams,
  FindManyParams,
  FindUniqueParams,
  GroupByParams,
  Repository,
  RepositoryOptions,
  UpdateManyParams,
  UpdateParams,
  UpsertParams,
  WhereParams,
  WhereUniqueParams
} from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain";
import { Service } from "@open-system/core-shared-injection";
import {
  Logger,
  NotFoundError,
  RequiredError
} from "@open-system/core-shared-utilities";
import {
  BaseSQLiteDatabase,
  SQLiteTableWithColumns
} from "drizzle-orm/sqlite-core";
import { formatWhereParams } from "../utilities/format-params";

@Service(Repository)
export class DrizzleRepository<
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TSelectKeys
> extends Repository<TEntity, TSelectKeys, TCacheKeys> {
  constructor(
    protected schema: SQLiteTableWithColumns<any>,
    protected db: BaseSQLiteDatabase<"async", any, any>,
    logger: Logger,
    options: RepositoryOptions<TEntity, TSelectKeys, TCacheKeys>
  ) {
    super(logger, options);
  }

  public override batchLoadFn: BatchLoadFn<TEntity, TSelectKeys, TCacheKeys> =
    async (keys: TSelectKeys[]) => {
      const promises = [];

      keys.map((key: TSelectKeys) => {
        const where = key as WhereParams<TEntity, keyof TEntity>;

        const promise = this.db
          .select()
          .from(this.schema)
          .where(formatWhereParams<TEntity>(this.schema, where));
        promises.push(promise);
      });

      return await Promise.all(promises);
    };

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

  protected override innerFindFirst = async (
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
  };

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

  protected override innerAggregate = async (
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
  };
}
