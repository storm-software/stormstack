import { IEntity } from "@open-system/core-server-domain";
import { Service } from "@open-system/core-shared-injection";
import { JsonParser } from "@open-system/core-shared-serialization";
import { BaseUtilityClass, Logger } from "@open-system/core-shared-utilities";
import {
  AggregateParams,
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  FindFirstParams,
  FindManyParams,
  FindUniqueParams,
  GroupByParams,
  REPOSITORY_TOKEN,
  UpdateManyParams,
  UpdateParams,
  UpsertParams
} from "../types";

@Service()
export abstract class Repository<
  TData extends IEntity = IEntity
> extends BaseUtilityClass {
  constructor(private readonly logger: Logger) {
    super(REPOSITORY_TOKEN);
  }

  public async findUnique(params: FindUniqueParams<TData>): Promise<TData> {
    this.logger.debug(
      `Finding unique record where - '${JsonParser.stringify(params.where)}'`
    );

    return this.innerFindUnique(params);
  }

  public async findFirst(params: FindFirstParams<TData>): Promise<TData> {
    this.logger.debug(
      `Finding first record - '${JsonParser.stringify(params)}'`
    );

    return this.innerFindFirst(params);
  }

  public async findMany(params: FindManyParams<TData>): Promise<TData[]> {
    this.logger.debug(
      `Finding many records - '${JsonParser.stringify(params)}'`
    );

    return this.innerFindMany(params);
  }

  public async create(params: CreateParams<TData>): Promise<TData["id"]> {
    this.logger.debug(`Creating record - '${JsonParser.stringify(params)}'`);

    return this.innerCreate(params);
  }

  public async delete(params: DeleteParams<TData>): Promise<TData["id"]> {
    this.logger.debug(`Deleting record - '${JsonParser.stringify(params)}'`);

    return this.innerDelete(params);
  }

  public async deleteMany(
    params: DeleteManyParams<TData>
  ): Promise<Array<TData["id"]>> {
    this.logger.debug(
      `Deleting many records - '${JsonParser.stringify(params)}'`
    );

    return this.innerDeleteMany(params);
  }

  public async update(params: UpdateParams<TData>): Promise<TData["id"]> {
    this.logger.debug(`Updating record - '${JsonParser.stringify(params)}'`);

    return this.innerUpdate(params);
  }

  public async updateMany(
    params: UpdateManyParams<TData>
  ): Promise<Array<TData["id"]>> {
    this.logger.debug(
      `Updating many records - '${JsonParser.stringify(params)}'`
    );

    return this.innerUpdateMany(params);
  }

  public async upsert(params: UpsertParams<TData>): Promise<TData["id"]> {
    this.logger.debug(`Upsert record - '${JsonParser.stringify(params)}'`);

    return this.innerUpsert(params);
  }

  public async aggregate(params: AggregateParams<TData>): Promise<TData[]> {
    this.logger.debug(`Aggregate record - '${JsonParser.stringify(params)}'`);

    return this.innerAggregate(params);
  }

  public async groupBy(params: GroupByParams<TData>): Promise<TData[]> {
    this.logger.debug(`Group By record - '${JsonParser.stringify(params)}'`);

    return this.innerGroupBy(params);
  }

  protected abstract innerFindUnique: (
    params: FindUniqueParams<TData>
  ) => Promise<TData>;

  protected abstract innerFindFirst: (
    params: FindFirstParams<TData>
  ) => Promise<TData>;

  protected abstract innerFindMany: (
    params: FindFirstParams<TData>
  ) => Promise<TData[]>;

  protected abstract innerCreate: (
    params: CreateParams<TData>
  ) => Promise<TData["id"]>;

  protected abstract innerDelete: (
    params: DeleteParams<TData>
  ) => Promise<TData["id"]>;

  protected abstract innerDeleteMany: (
    params: DeleteManyParams<TData>
  ) => Promise<Array<TData["id"]>>;

  protected abstract innerUpdate: (
    params: UpdateParams<TData>
  ) => Promise<TData["id"]>;

  protected abstract innerUpdateMany: (
    params: UpdateManyParams<TData>
  ) => Promise<Array<TData["id"]>>;

  protected abstract innerUpsert: (
    params: UpsertParams<TData>
  ) => Promise<TData["id"]>;

  protected abstract innerAggregate: (
    params: AggregateParams<TData>
  ) => Promise<TData[]>;

  protected abstract innerGroupBy: (
    params: GroupByParams<TData>
  ) => Promise<TData[]>;
}
