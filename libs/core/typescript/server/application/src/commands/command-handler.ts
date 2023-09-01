import { IAggregateRoot } from "@open-system/core-server-domain";
import { ServerContext } from "../types";
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
      version = 1
    }: CommandHandlerParams<TRequest, TAggregate, TCommand, TContext>,
    handle: <
      TAggregate extends IAggregateRoot = IAggregateRoot,
      TCommand extends ICommand<TRequest> = ICommand<TRequest>,
      TContext extends ServerContext = ServerContext
    >(
      aggregate: TAggregate,
      command: TCommand,
      context: TContext
    ) => Promise<TAggregate>
  ) =>
  async (request: TRequest, context: TContext) => {
    const command = context.factories?.command<TRequest>(
      commandId,
      version,
      request
    ) as TCommand;

    const aggregate = await handle<TAggregate, TCommand, TContext>(
      context.factories?.aggregate<TAggregate>?.(
        request,
        command.id,
        context.correlationId,
        context.user.id
      ) as any,
      command,
      context
    );

    return aggregate;
  };
