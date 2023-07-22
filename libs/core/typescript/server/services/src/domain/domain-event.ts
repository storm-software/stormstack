/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateTime } from "@open-system/core-shared-utilities";
import { IntegrationEvent } from "./integration-event";
import { IAggregateRoot } from "./types";

export interface IDomainEvent<
  TAggregateRoot extends IAggregateRoot,
  out TData = Record<string, any>,
  out TIntegrationEvent extends IntegrationEvent<TData> = IntegrationEvent<TData>
> {
  timestamp: DateTime;
  type: TIntegrationEvent["type"];
  sourceId: TIntegrationEvent["sourceId"];
  version: TIntegrationEvent["version"];
  data: TIntegrationEvent["data"];
  aggregateId: TAggregateRoot["id"];
  aggregateType: TAggregateRoot["_type"];
  aggregateVersion: TAggregateRoot["version"];
}
