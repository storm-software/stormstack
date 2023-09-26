/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from "@stormstack/core-shared-logging/logger";
import { UniqueIdGenerator } from "@stormstack/core-shared-utilities/common";
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
      correlationId: UniqueIdGenerator.generate()
    };
  };
