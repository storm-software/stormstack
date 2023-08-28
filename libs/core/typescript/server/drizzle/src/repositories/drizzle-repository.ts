import {
  AggregateParams,
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  FindFirstParams,
  FindManyParams,
  FindUniqueParams,
  GroupByParams,
  Repository,
  UpdateManyParams,
  UpdateParams,
  UpsertParams
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

@Service()
export class DrizzleRepository<
  TData extends IEntity = IEntity
> extends Repository<TData> {
  constructor(
    protected schema: SQLiteTableWithColumns<any>,
    protected db: BaseSQLiteDatabase<"async", any, any>,
    logger: Logger
  ) {
    super(logger);
  }

  protected override innerFindUnique = async (
    params: FindUniqueParams<TData>
  ) => {
    const results = await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TData>(this.schema, params.where));
    if (!results || results.length === 0) {
      throw new NotFoundError("records");
    }

    return results[0] as TData;
  };

  protected override innerFindFirst = async (
    params: FindFirstParams<TData>
  ) => {
    const results = await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TData>(this.schema, params.where));
    if (!results || results.length === 0) {
      throw new NotFoundError("records");
    }

    return results[0] as TData;
  };

  protected override innerFindMany = async (params: FindManyParams<TData>) => {
    const results = await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TData>(this.schema, params.where));
    if (!results || results.length === 0) {
      throw new NotFoundError("records");
    }

    return results as TData[];
  };

  protected override innerCreate = async (params: CreateParams<TData>) => {
    return this.db.insert(this.schema).values(params.data);
  };

  protected override innerDelete = async (params: DeleteParams<TData>) => {
    return this.db
      .delete(this.schema)
      .where(formatWhereParams<TData>(this.schema, params.where));
  };

  protected override innerDeleteMany = async (
    params: DeleteManyParams<TData>
  ) => {
    return this.db
      .delete(this.schema)
      .where(formatWhereParams<TData>(this.schema, params.where));
  };

  protected override innerUpdate = async (params: UpdateParams<TData>) => {
    return this.db
      .update(this.schema)
      .set(params.data)
      .where(formatWhereParams<TData>(this.schema, params.where));
  };

  protected override innerUpdateMany = async (
    params: UpdateManyParams<TData>
  ) => {
    return this.db
      .update(this.schema)
      .set(params.data)
      .where(formatWhereParams<TData>(this.schema, params.where));
  };

  protected override innerUpsert = async (params: UpsertParams<TData>) => {
    if (params.update) {
      return this.db
        .update(this.schema)
        .set(params.update)
        .where(formatWhereParams<TData>(this.schema, params.where));
    } else if (params.create) {
      return this.db.insert(this.schema).values(params.create);
    } else {
      throw new RequiredError("No update or create data provided");
    }
  };

  protected override innerAggregate = async (
    params: AggregateParams<TData>
  ) => {
    return (await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TData>(this.schema, params.where))) as TData[];
  };

  protected override innerGroupBy = async (params: GroupByParams<TData>) => {
    return (await this.db
      .select()
      .from(this.schema)
      .where(formatWhereParams<TData>(this.schema, params.where))) as TData[];
  };
}
