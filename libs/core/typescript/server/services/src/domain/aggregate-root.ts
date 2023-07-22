import { BaseUtilityClass, DateTime } from "@open-system/core-shared-utilities";
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
  #version = 0;
  #uncommittedEvents = [] as IDomainEvent<typeof this>[];

  public get isNew() {
    return this.#version === 0;
  }

  public get version() {
    return this.#version;
  }

  public get uncommittedEvents() {
    return this.#uncommittedEvents;
  }

  public clearUncommittedEvents = () => {
    this.#uncommittedEvents = [];
  };

  public apply(event: IDomainEvent<typeof this>) {
    if (event.aggregateVersion !== this.#version + 1) {
      throw new Error(
        `Invalid event version: ${event.aggregateVersion} for aggregate ${this.id} (current version ${this.version}).`
      );
    }
    if (event.aggregateId !== this.id) {
      throw new Error(
        `Invalid event id: ${event.aggregateId} for aggregate ${this.id}.`
      );
    }

    this.innerApply(event);
    this.#version++;
  }

  public constructor(public readonly id: string) {
    super(AGGREGATE_ROOT_TOKEN);
  }

  protected emit(event: IntegrationEvent) {
    this.#uncommittedEvents.push({
      timestamp: DateTime.current,
      type: event.type,
      version: event.version,
      sourceId: event.sourceId,
      data: event.data,
      aggregateId: this.id,
      aggregateVersion: this.#version + this.#uncommittedEvents.length + 1,
      aggregateType: this._type,
    });
  }

  protected abstract innerApply: <
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(
    event: IDomainEvent<TAggregate>
  ) => void;
}
