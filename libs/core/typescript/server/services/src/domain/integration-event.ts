/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { IIntegrationEvent, INTEGRATION_EVENT_TOKEN } from "./types";

export abstract class IntegrationEvent
  extends BaseUtilityClass
  implements IIntegrationEvent
{
  readonly #id: string;
  readonly #version: number;
  readonly #sourceId: string | undefined;
  readonly #eventType: string;

  public constructor(eventType: string, version = 1, sourceId?: string) {
    super(INTEGRATION_EVENT_TOKEN);

    this.#id = `${eventType}-v${version}`;
    this.#eventType = eventType;
    this.#version = version;
    this.#sourceId = sourceId;
  }

  public get id(): string {
    return this.#id;
  }

  public get eventType(): string {
    return this.#eventType;
  }

  public get version(): number {
    return this.#version;
  }

  public get sourceId(): string | undefined {
    return this.#sourceId;
  }

  public abstract stringify(): string;
}
