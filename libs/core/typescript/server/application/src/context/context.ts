/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { IAggregateRoot } from "@open-system/core-server-domain";
import { ServerConfigManager } from "@open-system/core-server-utilities";
import { Logger } from "@open-system/core-shared-utilities";
import { ICommand } from "../commands";
import { EventPublisher, EventStore } from "../providers";
import { Repository } from "../repositories";

export type UserContext<TContext = {}> = Record<string, any> &
  TContext & {
    id: string;
    name?: string;
    email?: string;
  };

export type FactoriesContext = {
  aggregate: <TAggregate extends IAggregateRoot = IAggregateRoot>(
    request: any,
    sourceId: string,
    correlationId: string,
    userId: string
  ) => TAggregate;
  command: <TRequest>(
    commandId: string,
    version: number,
    request: TRequest
  ) => ICommand<TRequest>;
};

export type BaseServerContext<
  TUser extends UserContext = UserContext,
  TFactories extends FactoriesContext = FactoriesContext
> = {
  correlationId: string;
  logger: Logger;
  user: UserContext<TUser>;
  config: ServerConfigManager;
  factories: TFactories;
};

export type ServerContext<TUser extends UserContext = UserContext> =
  BaseServerContext<TUser> & {
    repository: Repository;
  };

export type EventSourcedServerContext<TUser extends UserContext = UserContext> =
  ServerContext<TUser> & {
    eventStore: EventStore;
    snapshotStore: any;
    eventPublisher: EventPublisher;
  };
