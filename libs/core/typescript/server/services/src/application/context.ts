/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Logger } from "@open-system/core-shared-utilities";
import { EventPublisher } from "./event-publisher";
import { EventStore } from "./event-store";
import { Repository } from "./repository";

export type UserContext<TContext = {}> = Record<string, any> &
  TContext & {
    id: string;
    name?: string;
    email?: string;
  };

export type ServerContext<TContext = {}, TUser = {}> = Record<string, any> & {
  logger: Logger;
  user: UserContext<TUser>;
} & TContext;

export type ComplexServerContext<TContext = {}, TUser = {}> = Record<
  string,
  any
> &
  ServerContext<TContext, TUser> & {
    eventStore: EventStore;
    snapshotStore: any;
    eventPublisher: EventPublisher;
  } & TContext;

export type SimpleServerContext<TContext = {}, TUser = {}> = Record<
  string,
  any
> &
  ServerContext<TContext, TUser> & {
    repository: Repository;
  } & TContext;
