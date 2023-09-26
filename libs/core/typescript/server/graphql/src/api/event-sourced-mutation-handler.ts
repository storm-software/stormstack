/* eslint-disable @typescript-eslint/no-explicit-any */
/*import {
  CommandHandlerParams,
  EventSourcedServerContext,
  IAggregateRoot,
  ICommand,
  eventSourcedCommandHandler,
} from "@stormstack/core-server-services";
import z from "zod";
export type GraphQLMutationHandler<
TRequest,
TAggregate extends IAggregateRoot,
TCommand extends ICommand<TRequest> = ICommand<TRequest>,
TContext extends EventSourcedServerContext = EventSourcedServerContext
> = CommandHandlerParams<TRequest, TAggregate, TCommand, TContext> & {

}

export const eventSourcedMutationHandler =
  <
    TRequest,
    TAggregate extends IAggregateRoot,
    TCommand extends ICommand<TRequest> = ICommand<TRequest>,
    TContext extends EventSourcedServerContext = EventSourcedServerContext
  >(
    params: CommandHandlerParams<TRequest, TAggregate, TCommand, TContext>
  ) =>
  async (_: any, request: TRequest, context: TContext) => {
    await eventSourcedCommandHandler<TRequest, TAggregate, TCommand, TContext>(
      params
    )(request, context);
}*/
