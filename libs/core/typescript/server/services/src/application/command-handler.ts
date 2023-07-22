import { isPromise } from "@open-system/core-shared-utilities";
import { IAggregateRoot } from "../domain";
import { ICommand } from "./command";
import { ServerContext } from "./context";

export const createCommandHandler =
  <
    TCommand extends ICommand,
    TAggregate extends IAggregateRoot = IAggregateRoot,
    TContext extends ServerContext = ServerContext
  >({
    Aggregate,
    prepare,
    handle,
  }: {
    Aggregate: new (id: string) => TAggregate;
    prepare: (
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
  async (command: TCommand, context: TContext) => {
    let aggregate = prepare(new Aggregate(command.id), command, context);
    if (isPromise(aggregate)) {
      aggregate = await aggregate;
    }

    aggregate = await handle(aggregate, command, context);

    return aggregate;
  };
