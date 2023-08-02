import { IAggregateRoot, IDomainEvent } from "@open-system/core-server-domain";
import {
  ArrayElement,
  BaseUtilityClass,
  Logger,
} from "@open-system/core-shared-utilities";
import { EVENT_STORE_TOKEN } from "../types";

export abstract class EventStore extends BaseUtilityClass {
  constructor(protected readonly logger: Logger) {
    super(EVENT_STORE_TOKEN);
  }

  public async getEvents<TAggregate extends IAggregateRoot = IAggregateRoot>(
    id: TAggregate["id"]
  ): Promise<IDomainEvent<TAggregate>[]> {
    this.logger.debug(`Getting domain events for ID - '${id}'`);

    return this.innerGetEvents<TAggregate>(id);
  }

  public async saveEvents<TAggregate extends IAggregateRoot = IAggregateRoot>(
    id: TAggregate["id"],
    events: TAggregate["uncommittedEvents"]
  ): Promise<void> {
    this.logger.debug(`Saving domain events for ID - '${id}'`);

    return this.innerSaveEvents<TAggregate>(id, events);
  }

  public async saveEvent<TAggregate extends IAggregateRoot = IAggregateRoot>(
    id: TAggregate["id"],
    event: ArrayElement<TAggregate["uncommittedEvents"]>
  ): Promise<void> {
    this.logger.debug(`Saving domain events for ID - '${id}'`);

    return this.innerSaveEvents<TAggregate>(id, [event]);
  }

  protected abstract innerGetEvents: <
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(
    id: TAggregate["id"]
  ) => Promise<IDomainEvent<TAggregate>[]>;

  protected abstract innerSaveEvents: <
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(
    id: TAggregate["id"],
    events: TAggregate["uncommittedEvents"]
  ) => Promise<void>;
}
