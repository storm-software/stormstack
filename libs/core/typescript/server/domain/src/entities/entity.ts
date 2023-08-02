import { BaseUtilityClass } from "@open-system/core-shared-utilities";
import { ENTITY_TOKEN, IEntity } from "../types";

export abstract class Entity extends BaseUtilityClass implements IEntity {
  private _sequence = 0;

  public get isNew() {
    return this._sequence === 0;
  }

  public get sequence() {
    return this._sequence;
  }

  public constructor(
    public readonly id: string,
    public readonly currentUserId: string
  ) {
    super(ENTITY_TOKEN);
  }

  protected increment() {
    return this._sequence++;
  }
}
