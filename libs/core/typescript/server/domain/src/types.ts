/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IBaseUtilityClass,
  IIdentity,
  IRelayTypeField,
  ISequenced,
  IVersioned
} from "@open-system/core-shared-utilities";

export interface IEntity
  extends ISequenced,
    IIdentity,
    IRelayTypeField,
    IBaseUtilityClass {
  currentUserId: string;
}

export interface IAggregateRoot extends IEntity {
  uncommittedEvents: IDomainEvent<any>[];
  apply: (event: IDomainEvent<any>) => void;
  clearUncommittedEvents: () => void;
}

export interface IAggregateManager
  extends IVersioned,
    IIdentity,
    IBaseUtilityClass {
  uncommittedEvents: IDomainEvent<any>[];
  apply: (event: IDomainEvent<any>) => void;
  clearUncommittedEvents: () => void;
}

export interface IDomainEvent<
  TAggregateRoot extends IAggregateRoot,
  out TIntegrationEvent extends IIntegrationEvent = IIntegrationEvent
> {
  timestamp: Date;
  correlationId: string;
  sourceId: string;
  userId: string;
  aggregateId: TAggregateRoot["id"];
  aggregateSequence: number;
  aggregateType: string;
  integrationEvent: TIntegrationEvent;
}

export interface IIntegrationEvent extends IVersioned, IIdentity {
  eventType: string;
  sourceId?: string;
}

export const ENTITY_TOKEN = Symbol.for("ENTITY_TOKEN");
export const AGGREGATE_MANAGER_TOKEN = Symbol.for("AGGREGATE_MANAGER_TOKEN");
export const INTEGRATION_EVENT_TOKEN = Symbol.for("INTEGRATION_EVENT_TOKEN");
export const DOMAIN_EVENT_TOKEN = Symbol.for("DOMAIN_EVENT_TOKEN");
