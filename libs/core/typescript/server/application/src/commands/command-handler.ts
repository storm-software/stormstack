import { IAggregateRoot } from "@open-system/core-server-domain";
import { isPromise } from "@open-system/core-shared-utilities";
import { ServerContext } from "../context";
import { ICommand } from "./command";

export type CommandHandlerParams<
  TRequest,
  TAggregate extends IAggregateRoot = IAggregateRoot,
  TCommand extends ICommand<TRequest> = ICommand<TRequest>,
  TContext extends ServerContext = ServerContext
> = {
  commandId: string;
  version: number;
};

export const commandHandler =
  <
    TRequest,
    TAggregate extends IAggregateRoot = IAggregateRoot,
    TCommand extends ICommand<TRequest> = ICommand<TRequest>,
    TContext extends ServerContext = ServerContext
  >(
    {
      commandId,
      version = 1,
    }: CommandHandlerParams<TRequest, TAggregate, TCommand, TContext>,
    handle: (
      aggregate: TAggregate,
      command: TCommand,
      context: TContext
    ) => Promise<TAggregate>
  ) =>
  async (request: TRequest, context: TContext) => {
    const command = context.factories.command<TRequest>(
      commandId,
      version,
      request
    );

    let aggregate = context.factories.aggregate<TRequest>(
      request,
      command.id,
      context.correlationId,
      context.user.id
    );
    if (isPromise(aggregate)) {
      aggregate = await aggregate;
    }

    aggregate = await handle(aggregate, command, context);

    return aggregate;
  };
