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

export type ServerContext<TUser extends UserContext = UserContext> = {
  logger: Logger;
  user: UserContext<TUser>;
};

export type ComplexServerContext<TUser extends UserContext = UserContext> =
  ServerContext<TUser> & {
    eventStore: EventStore;
    snapshotStore: any;
    eventPublisher: EventPublisher;
  };

export type SimpleServerContext<TUser extends UserContext = UserContext> =
  ServerContext<TUser> & {
    repository: Repository;
  };
