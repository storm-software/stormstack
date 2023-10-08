/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@stormstack/core-server-domain/types";
import { Provider } from "@stormstack/core-shared-injection";
import { Logger } from "@stormstack/core-shared-logging";
import {
  BaseUtilityClass,
  isEmpty,
  isError
} from "@stormstack/core-shared-utilities/common";
import {
  BaseErrorCode,
  FieldError,
  StormError
} from "@stormstack/core-shared-utilities/errors";
import { UserContext } from "../context";
import { Repository } from "../repositories/repository";
import {
  CreateParams,
  FindCountParams,
  FindManyParams,
  SERVICE_TOKEN,
  WhereUniqueParams
} from "../types";

@Provider(Service)
export abstract class Service<
  TEntity extends IEntity = IEntity
> extends BaseUtilityClass {
  /**
   * The name given to the records used by this `Service` instance.
   * Useful for APM tools, error messages, and logging in general.
   *
   * Meant to be over-written in the extending class.
   */
  public name: string;

  constructor(
    protected readonly logger: Logger,
    protected readonly repository: Repository<TEntity>,
    protected readonly user: UserContext
  ) {
    super(SERVICE_TOKEN);

    this.name ??= this.constructor.name.includes("Service")
      ? this.constructor.name.replace("Service", "")
      : this.constructor.name;
  }

  /*public get = async (
    selector: UniqueModelSelector<TModel>
  ): Promise<WithMetadata<TModel>> => {
    const entity = await this.repository.findUnique(
      selector as FindUniqueParams<TEntity>
    );
    if (!entity) {
      throw new NotFoundError(this.repository.name);
    }

    const model = this.mapEntityToModel(entity);
    if (isPromise(model)) {
      return this.addMetadata<TModel>(await model);
    }

    return this.addMetadata<TModel>(model);
  };*/

  public getById = async (id: string): Promise<TEntity> => {
    const result = await this.repository.findUnique({
      where: { id } as WhereUniqueParams<TEntity>
    });

    return this.handleResult<TEntity>(result);
  };

  public get = async (
    selector: FindManyParams<TEntity>
  ): Promise<Array<TEntity>> => {
    const results = await this.repository.findMany(selector);

    return this.handleResults<TEntity>(results);
  };

  public count = async (
    selector: FindCountParams<TEntity>
  ): Promise<number> => {
    const result = await this.repository.findCount(selector);

    return this.handleResult<number>(result);
  };

  public create = async (
    params: CreateParams<TEntity>
  ): Promise<TEntity["id"]> => {
    const result = await this.repository.create(params);

    return this.handleResult<TEntity["id"]>(result);
  };

  private handleResult = <TData = any>(entity: TData | Error): TData => {
    if (isEmpty(entity)) {
      throw new StormError(
        BaseErrorCode.record_not_found,
        `No ${this.name} were found`
      );
    }
    if (isError(entity) || StormError.isBaseError(entity)) {
      throw entity as Error;
    }

    return entity as TData;
  };

  private handleResults = <TData = any>(
    results: Array<TData | Error> | Error
  ): Array<TData> => {
    if (isError(results)) {
      throw results as Error;
    }

    if (isEmpty(results) || !Array.isArray(results) || results.length === 0) {
      throw new StormError(
        BaseErrorCode.record_not_found,
        `No ${this.name} were found`
      );
    }

    const { errors, entities } = results.reduce(
      (
        ret: {
          errors: FieldError[];
          entities: Array<TData>;
        },
        result
      ) => {
        if (FieldError.isFieldError(result)) {
          ret.errors.push(result);
        } else if (isError(result)) {
          throw result;
        } else {
          ret.entities.push(result);
        }

        return ret;
      },
      { errors: [], entities: [] }
    );
    if (errors && errors.length > 0) {
      const error = new StormError(BaseErrorCode.invalid_request);
      error.addFieldErrors(errors);

      throw error;
    }

    return entities as Array<TData>;
  };
}
