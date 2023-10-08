/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DateTime,
  IBaseClass,
  IBaseUtilityClass,
  IIdentity,
  ISequenced,
  IVersioned
} from "@stormstack/core-shared-utilities";

export interface IEntity extends ISequenced, IIdentity, IBaseClass {
  /**
   * The sequence number (version, or event counter, etc.) of the record
   */
  sequence: number;

  /**
   * A timestamp of when the record was created
   */
  createdAt: DateTime;

  /**
   * The user who created the record
   */
  createdBy: string;

  /**
   * A timestamp of when the record was last updated
   */
  updatedAt?: DateTime;

  /**
   * The user who last updated the record
   */
  updatedBy?: string;
}

export type Metadata = Pick<
  IEntity,
  | "__typename"
  | "sequence"
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
>;

export type WithMetadata<TData = any> = TData & Metadata;

export type WithoutMetadata<TData = any> = Omit<TData, keyof Metadata>;

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
  timestamp: DateTime;
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
