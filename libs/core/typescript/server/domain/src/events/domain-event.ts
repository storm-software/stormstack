/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUtilityClass, DateTime } from "@stormstack/core-shared-utilities";
import {
  DOMAIN_EVENT_TOKEN,
  IAggregateRoot,
  IDomainEvent,
  IIntegrationEvent
} from "../types";

export class DomainEvent<
    TAggregateRoot extends IAggregateRoot,
    out TIntegrationEvent extends IIntegrationEvent = IIntegrationEvent
  >
  extends BaseUtilityClass
  implements IDomainEvent<TAggregateRoot, TIntegrationEvent>
{
  public readonly timestamp: DateTime;

  public constructor(
    public readonly correlationId: string,
    public readonly sourceId: string,
    public readonly userId: string,
    public readonly aggregateId: TAggregateRoot["id"],
    public readonly aggregateSequence: TAggregateRoot["sequence"],
    public readonly aggregateType: TAggregateRoot["__typename"],
    public readonly integrationEvent: TIntegrationEvent
  ) {
    super(DOMAIN_EVENT_TOKEN);

    this.timestamp = DateTime.create();
  }
}
