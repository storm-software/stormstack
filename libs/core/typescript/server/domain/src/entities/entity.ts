import { BaseClass } from "@stormstack/core-shared-utilities/common/base-class";
import { DateTime } from "@stormstack/core-shared-utilities/common/date-time";
import { ENTITY_TOKEN, IEntity } from "../types";

export abstract class Entity extends BaseClass implements IEntity {
  /**
   * Indicates whether the record is new or not
   */
  public get isNew() {
    return this._sequence === 0;
  }

  /**
   * The sequence number (version, or event counter, etc.) of the record
   */
  public get sequence() {
    return this._sequence;
  }

  /**
   * A timestamp of when the record was created
   */
  public get createdAt() {
    return !this.isNew && this._createdAt ? this._createdAt : this.__timestamp;
  }

  /**
   * The user who created the record
   */
  public get createdBy() {
    return this.isNew && this._createdBy
      ? this._createdBy
      : this._currentUserId;
  }

  /**
   * A timestamp of when the record was last updated
   */
  public get updatedAt() {
    return !this.isNew ? this.__timestamp : undefined;
  }

  /**
   * The user who last updated the record
   */
  public get updatedBy() {
    return !this.isNew ? this._currentUserId : undefined;
  }

  public constructor(
    public readonly id: string,
    protected readonly _currentUserId: string,
    private _sequence = 0,
    private _createdAt?: DateTime,
    private _createdBy?: string,
    private _updatedAt?: DateTime,
    private _updatedBy?: string
  ) {
    super(ENTITY_TOKEN);

    this.id = id ? id : this.__id;
  }

  /**
   * Increase the sequence number by one
   * @returns The updated sequence number
   */
  protected increment() {
    return ++this._sequence;
  }
}
