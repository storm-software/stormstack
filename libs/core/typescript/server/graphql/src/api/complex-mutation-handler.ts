import { ICommand } from "../../../services/src/application/command";
import { createComplexCommandHandler } from "../../../services/src/application/complex-command-handler";
import { ComplexServerContext } from "../../../services/src/application/context";
import { IAggregateRoot } from "../../../services/src/domain/types";

export const createComplexMutationHandler =
  <
    TRequest,
    TCommand extends ICommand,
    TAggregate extends IAggregateRoot,
    TContext extends ComplexServerContext = ComplexServerContext
  >({
    commandId,
    version = 1,
    Aggregate,
    prepare,
    handle,
  }: {
    commandId: string;
    version?: number;
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
  async (_: any, request: TRequest, context: TContext) =>
    await createComplexCommandHandler<TCommand, TAggregate, TContext>({
      Aggregate,
      prepare,
      handle,
    })({ commandId, version, ...request } as unknown as TCommand, context);
