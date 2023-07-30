import { BaseUtilityClass, Logger } from "@open-system/core-shared-utilities";
import { Injectable } from "graphql-modules";
import { IEntity } from "../domain";
import { REPOSITORY_TOKEN } from "../types";

@Injectable()
export abstract class Repository<
  TData extends IEntity = IEntity
> extends BaseUtilityClass {
  constructor(private readonly logger: Logger) {
    super(REPOSITORY_TOKEN);
  }

  public async getById(id: TData["id"]): Promise<TData> {
    this.logger.debug(`Getting record for ID - '${id}'`);

    return this.innerGet(id);
  }

  public async addOrUpdate(data: TData): Promise<void> {
    this.logger.debug(`Adding or updating record for ID - '${data.id}'`);

    data.sequence++;
    if (data.sequence === 0) {
      return this.innerAdd(data);
    }
    return this.innerUpdate(data);
  }

  public async remove(id: TData["id"]): Promise<void> {
    this.logger.debug(`Remove record for ID - '${id}'`);

    return this.innerRemove(id);
  }

  protected abstract innerGet: (id: TData["id"]) => Promise<TData>;

  protected abstract innerAdd: (data: TData) => Promise<void>;

  protected abstract innerUpdate: (data: TData) => Promise<void>;

  protected abstract innerRemove: (id: TData["id"]) => Promise<void>;
}
