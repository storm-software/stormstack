/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { IIntegrationEvent, INTEGRATION_EVENT_TOKEN } from "../types";

export abstract class IntegrationEvent
  extends BaseUtilityClass
  implements IIntegrationEvent
{
  private readonly _id: string;
  private readonly _version: number;
  private readonly _sourceId: string | undefined;
  private readonly _eventType: string;

  public constructor(eventType: string, version = 1, sourceId?: string) {
    super(INTEGRATION_EVENT_TOKEN);

    this._id = `${eventType}-v${version}`;
    this._eventType = eventType;
    this._version = version;
    this._sourceId = sourceId;
  }

  public get id(): string {
    return this._id;
  }

  public get eventType(): string {
    return this._eventType;
  }

  public get version(): number {
    return this._version;
  }

  public get sourceId(): string | undefined {
    return this._sourceId;
  }

  public abstract stringify(): string;
}
