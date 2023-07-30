import { IAggregateRoot, IDomainEvent } from "../domain";
import { ICommand } from "./command";
import { createCommandHandler } from "./command-handler";
import { ComplexServerContext } from "./context";

export const createComplexCommandHandler = <
  TCommand extends ICommand,
  TAggregate extends IAggregateRoot = IAggregateRoot,
  TContext extends ComplexServerContext = ComplexServerContext
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
      if (prepare) {
        aggregate = await prepare(aggregate, command, context);
      }

      if (command.id) {
        const events = await context.eventStore.getEvents<TAggregate>(
          command.id
        );

        events.forEach((event: IDomainEvent<TAggregate>) =>
          aggregate.apply(event)
        );
      }

      return aggregate;
    },
    handle: async (
      aggregate: TAggregate,
      command: TCommand,
      context: TContext
    ) => {
      aggregate = await handle(aggregate, command, context);
      await context.eventPublisher.publishEvents<TAggregate>(
        aggregate.uncommittedEvents
      );

      /*aggregate.uncommittedEvents.forEach(event => {
        aggregate.apply(event);
      });*/

      aggregate.clearUncommittedEvents();

      return aggregate;
    },
  });
