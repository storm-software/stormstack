import { IAggregateRoot, IDomainEvent } from "@stormstack/core-server-domain";
import { Logger } from "@stormstack/core-shared-logging/logger";
import { BaseUtilityClass } from "@stormstack/core-shared-utilities/common";
import { EVENT_PUBLISHER_TOKEN } from "../types";
import { EventStore } from "./event-store";
import { MessageBroker } from "./message-broker";

export abstract class EventPublisher extends BaseUtilityClass {
  constructor(
    protected readonly logger: Logger,
    protected readonly broker: MessageBroker,
    protected readonly eventStore: EventStore
  ) {
    super(EVENT_PUBLISHER_TOKEN);
  }

  public async publishEvents<
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(events: IDomainEvent<TAggregate>[]): Promise<void> {
    if (events.length > 0) {
      this.logger.debug(`Publishing ${events.length} events`);

      await this.eventStore.saveEvents<TAggregate>(
        events[0].aggregateId,
        events
      );

      await Promise.all(
        events.map((event: IDomainEvent<TAggregate>) =>
          this.publishEvent<TAggregate>(event)
        )
      );
    }
  }

  protected async publishEvent<
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(event: IDomainEvent<TAggregate>): Promise<void> {
    this.logger.debug(`Publishing event: ${JSON.stringify(event)}`);

    return await this.innerPublishEvent<TAggregate>(event);
  }

  protected abstract innerPublishEvent: <
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(
    event: IDomainEvent<TAggregate>
  ) => Promise<void>;
}
