import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { IDomainEvent } from "./domain-event";
import { IntegrationEvent } from "./integration-event";
import { AGGREGATE_ROOT_TOKEN, IAggregateRoot } from "./types";

/**
 * A base abstract class to be inherited by all utility classes added.
 *
 * @remarks This class implements core functionality such as the id and symbol properties
 */
export abstract class AggregateRoot
  extends BaseUtilityClass
  implements IAggregateRoot
{
  #sequence = 0;
  #uncommittedEvents = [] as IDomainEvent<typeof this>[];

  public get isNew() {
    return this.#sequence === 0;
  }

  public get sequence() {
    return this.#sequence;
  }

  public get uncommittedEvents() {
    return this.#uncommittedEvents;
  }

  public clearUncommittedEvents = () => {
    this.#uncommittedEvents = [];
  };

  public apply(event: IDomainEvent<typeof this>) {
    if (event.aggregateSequence !== this.#sequence + 1) {
      throw new Error(
        `Invalid event sequence: ${event.aggregateSequence} for aggregate ${
          this.id
        } (current sequence ${this.#sequence}).`
      );
    }
    if (event.aggregateId !== this.id) {
      throw new Error(
        `Invalid event id: ${event.aggregateId} for aggregate ${this.id}.`
      );
    }

    this.innerApply(event);
    this.#sequence++;
  }

  public constructor(
    public readonly id: string,
    public readonly currentUserId: string
  ) {
    super(AGGREGATE_ROOT_TOKEN);
  }

  protected emit(event: IntegrationEvent) {
    this.#uncommittedEvents.push({
      eventType: event.eventType,
      eventVersion: event.version,
      timestamp: new Date(Date.now()),
      correlationId: "",
      userId: this.currentUserId,
      aggregateId: this.id,
      aggregateSequence: this.#sequence + this.#uncommittedEvents.length + 1,
      aggregateType: this._type,
      integrationEvent: event,
    });
  }

  protected abstract innerApply: <
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(
    event: IDomainEvent<TAggregate>
  ) => void;
}
