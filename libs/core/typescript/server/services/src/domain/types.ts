/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IBaseUtilityClass,
  IIdentity,
  ISequenced,
  IVersioned,
} from "@open-system/core-shared-utilities";
import { IDomainEvent } from "./domain-event";

export interface IEntity extends ISequenced, IIdentity, IBaseUtilityClass {}

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

export interface IIntegrationEvent extends IVersioned, IIdentity {
  eventType: string;
  sourceId?: string;
}

export const AGGREGATE_ROOT_TOKEN = Symbol.for("AGGREGATE_ROOT_TOKEN");
export const AGGREGATE_MANAGER_TOKEN = Symbol.for("AGGREGATE_MANAGER_TOKEN");
export const INTEGRATION_EVENT_TOKEN = Symbol.for("INTEGRATION_EVENT_TOKEN");
