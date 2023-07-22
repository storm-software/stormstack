import { IAggregateRoot } from "../domain";
import { ICommand } from "./command";
import { createCommandHandler } from "./command-handler";
import { SimpleServerContext } from "./context";

export const createSimpleCommandHandler = <
  TCommand extends ICommand,
  TAggregate extends IAggregateRoot = IAggregateRoot,
  TContext extends SimpleServerContext = SimpleServerContext
>({
  Aggregate,
  prepare,
  handle,
}: {
  Aggregate: new (id: string) => TAggregate;
  prepare?: (
    aggregate: TAggregate,
    command: TCommand,
    context: TContext
  ) => Promise<TAggregate> | TAggregate;
  handle: (
    aggregate: TAggregate,
    command: TCommand,
    context: TContext
  ) => Promise<TAggregate>;
}) =>
  createCommandHandler<TCommand, TAggregate, TContext>({
    Aggregate,
    prepare: async (
      aggregate: TAggregate,
      command: TCommand,
      context: TContext
    ) => {
      if (command.id) {
        aggregate = await context.repository.getById(command.id);
      }

      if (prepare) {
        aggregate = await prepare(aggregate, command, context);
      }

      return aggregate;
    },
    handle,
  });
