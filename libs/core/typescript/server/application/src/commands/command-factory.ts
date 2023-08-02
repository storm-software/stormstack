/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, UniqueIdGenerator } from "@open-system/core-shared-utilities";
import { ICommand } from "./command";

export const commandFactory =
  <TRequest>(logger: Logger) =>
  (
    commandId: string,
    version: number,
    request: TRequest
  ): ICommand<TRequest> => {
    logger.debug(`Creating command ${commandId} (v${version})`);

    return {
      id: commandId,
      version,
      request,
      correlationId: UniqueIdGenerator.generate(),
    };
  };
