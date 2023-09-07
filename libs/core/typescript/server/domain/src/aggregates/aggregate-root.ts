import { Entity } from "../entities";
import { DomainEvent } from "../events";
import { IAggregateRoot, IDomainEvent, IIntegrationEvent } from "../types";

/**
 * A base abstract class to be inherited by all utility classes added.
 *
 * @remarks This class implements core functionality such as the id and symbol properties
 */
export abstract class AggregateRoot extends Entity implements IAggregateRoot {
  private _uncommittedEvents = [] as IDomainEvent<typeof this>[];

  public get uncommittedEvents() {
    return this._uncommittedEvents;
  }

  public clearUncommittedEvents = () => {
    this._uncommittedEvents = [];
  };

  public apply(event: IDomainEvent<typeof this>) {
    if (event.aggregateSequence !== this.sequence + 1) {
      throw new Error(
        `Invalid event sequence: ${event.aggregateSequence} for aggregate ${this.id} (current sequence number: ${this.sequence}).`
      );
    }
    if (event.aggregateId !== this.id) {
      throw new Error(
        `Invalid event id: ${event.aggregateId} for aggregate ${this.id}.`
      );
    }

    this.innerApply(event);
    this.increment();
  }

  public constructor(
    id: string,
    currentUserId: string,
    public readonly sourceId: string,
    public readonly correlationId: string
  ) {
    super(id, currentUserId);
  }

  protected emit(event: IIntegrationEvent) {
    this._uncommittedEvents.push(
      new DomainEvent(
        this.sourceId,
        this.correlationId,
        this.createdBy,
        this.id,
        this.sequence + this._uncommittedEvents.length + 1,
        this.__typename,
        event
      )
    );
  }

  protected abstract innerApply: <
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(
    event: IDomainEvent<TAggregate>
  ) => void;
}
