/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { IIntegrationEvent, INTEGRATION_EVENT_TOKEN } from "./types";

export abstract class IntegrationEvent<TData = Record<string, any>>
  extends BaseUtilityClass
  implements IIntegrationEvent<TData>
{
  public readonly id: string;

  public abstract get data(): TData;

  public constructor(
    public type: string,
    public version = 1,
    public sourceId?: string
  ) {
    super(INTEGRATION_EVENT_TOKEN);

    this.id = `${type}-v${version}`;
  }
}
