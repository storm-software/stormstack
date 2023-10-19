/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from "@stormstack/core-shared-logging/logger";
import {
  IIdentity,
  UniqueIdGenerator
} from "@stormstack/core-shared-utilities";
import { AggregateRoot } from "./aggregate-root";

export const aggregateFactory =
  <TAggregate extends AggregateRoot>(
    logger: Logger,
    Aggregate: new (
      id: string,
      userId: string,
      sourceId: string,
      correlationId: string
    ) => TAggregate
  ) =>
  <TRequest = any>(
    request: TRequest,
    sourceId: string,
    correlationId: string,
    userId: string
  ): TAggregate => {
    const id = (request as IIdentity)?.id
      ? (request as IIdentity).id
      : UniqueIdGenerator.snowflake();

    logger.debug(
      `Creating aggregate for ${correlationId}${id ? " - " + id : ""}`
    );

    return new Aggregate(id, userId, sourceId, correlationId);
  };
