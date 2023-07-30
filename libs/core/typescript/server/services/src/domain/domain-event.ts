/* eslint-disable @typescript-eslint/no-explicit-any */
import { IntegrationEvent } from "./integration-event";
import { IAggregateRoot } from "./types";

export interface IDomainEvent<
  TAggregateRoot extends IAggregateRoot,
  out TIntegrationEvent extends IntegrationEvent = IntegrationEvent
> {
  eventType: string;
  eventVersion: number;
  timestamp: Date;
  correlationId: string;
  userId: string;
  aggregateId: TAggregateRoot["id"];
  aggregateSequence: TAggregateRoot["sequence"];
  aggregateType: TAggregateRoot["_type"];
  integrationEvent: TIntegrationEvent;
}
