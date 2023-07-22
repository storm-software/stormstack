import { BaseUtilityClass, Logger } from "@open-system/core-shared-utilities";
import { Injectable } from "graphql-modules";
import { IAggregateRoot, IDomainEvent } from "../domain";
import { EVENT_PUBLISHER_TOKEN } from "../types";

@Injectable()
export abstract class EventPublisher extends BaseUtilityClass {
  constructor(private readonly logger: Logger) {
    super(EVENT_PUBLISHER_TOKEN);
  }

  public async publishEvent<TAggregate extends IAggregateRoot = IAggregateRoot>(
    event: IDomainEvent<TAggregate>
  ): Promise<void> {
    this.logger.debug(`Publishing event: ${JSON.stringify(event)}`);

    return await this.innerPublish<TAggregate>(event);
  }

  public async publishEvents<
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(events: IDomainEvent<TAggregate>[]): Promise<void> {
    await Promise.all(
      events.map((event: IDomainEvent<TAggregate>) =>
        this.publishEvent<TAggregate>(event)
      )
    );
  }

  protected abstract innerPublish: <
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(
    event: IDomainEvent<TAggregate>
  ) => Promise<void>;
}
