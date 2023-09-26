import { BaseUtilityClass } from "@stormstack/core-shared-utilities";
import { RefObject } from "react";
import { FieldProxyConfig } from "../types";

export const FIELD_PROXY_SYMBOL = Symbol.for("FIELD_PROXY_SYMBOL");

/**
 * An object to map updates on the internal field-atom state to a input element's ref
 */
export class FieldProxy<
  TValue = any,
  TRef extends HTMLInputElement = HTMLInputElement
> extends BaseUtilityClass {
  public static create(config: FieldProxyConfig): FieldProxy {
    return new FieldProxy(
      config?.ref,
      config?.value,
      config?.setValue,
      config?.label,
      config?.setLabel,
      config?.error,
      config?.setError,
      config?.warning,
      config?.setWarning,
      config?.info,
      config?.setInfo,
      config?.disabled,
      config?.setDisabled,
      config?.focused,
      config?.setFocused,
      config?.required,
      config?.setRequired,
      config?.dirty,
      config?.setDirty
    ) as FieldProxy;
  }

  /**
   * Type check function to determine if the parameter is a FieldProxy object
   * @param obj - The object to check the type
   * @returns An indicator specifying if the object is a FieldProxy
   */
  public static isFieldProxy = <
    TValue = any,
    TRef extends HTMLInputElement = HTMLInputElement
  >(
    obj: unknown
  ): obj is FieldProxy<TValue, TRef> => {
    try {
      return (obj as FieldProxy<TValue, TRef>)?.__symbol === FIELD_PROXY_SYMBOL;
    } catch (e) {
      return false;
    }
  };

  public set name(nextName: string) {
    this.ref && (this.ref.name = nextName);
  }

  public get name() {
    return this.ref?.name ?? "";
  }

  public set value(nextValue: TValue | null) {
    this.ref && (this.ref.value = nextValue as string);
    this._setValue(nextValue);
  }

  public get value() {
    return this.ref?.value as TValue | null;
  }

  public set label(nextLabel: string | JSX.Element | null) {
    this._setLabel(nextLabel);
  }

  public get label() {
    return this._label;
  }

  public set required(nextRequired: boolean) {
    this.ref && (this.ref.required = nextRequired);
    this.ref && (this.ref.ariaRequired = nextRequired ? "true" : "false");
    this._setRequired(nextRequired);
  }

  public get required() {
    return this._required;
  }

  public set focused(nextFocused: boolean) {
    nextFocused && this.focus();
    this._setFocused(nextFocused);
  }

  public get focused() {
    return this._focused;
  }

  public set disabled(nextDisabled: boolean) {
    this.ref && (this.ref.disabled = nextDisabled);
    this._setDisabled(nextDisabled);
  }

  public get disabled() {
    return this._disabled;
  }

  public set dirty(nextDirty: boolean) {
    this._setDirty(nextDirty);
  }

  public get dirty() {
    return this._dirty;
  }

  public set error(nextError: undefined | string | null) {
    this._setError(nextError);
  }

  public get error() {
    return this._error;
  }

  public set warning(nextWarning: undefined | string | null) {
    this._setWarning(nextWarning);
  }

  public get warning() {
    return this._warning;
  }

  public set info(nextInfo: undefined | string | null) {
    this._setInfo(nextInfo);
  }

  public get info() {
    return this._info;
  }

  public get ref() {
    return this._ref.current;
  }

  protected constructor(
    public _ref: RefObject<TRef>,
    private _value: TValue | null,
    private _setValue: (value: TValue | null) => void,
    private _label: string | JSX.Element | null,
    private _setLabel: (label: string | JSX.Element | null) => void,
    private _error: undefined | string | null,
    private _setError: (error?: string | null) => void,
    private _warning: undefined | string | null,
    private _setWarning: (warning?: string | null) => void,
    private _info: undefined | string | null,
    private _setInfo: (info?: string | null) => void,
    private _disabled: boolean,
    private _setDisabled: (disabled: boolean) => void,
    private _focused: boolean,
    private _setFocused: (focused: boolean) => void,
    private _required: boolean,
    private _setRequired: (required: boolean) => void,
    private _dirty: boolean,
    private _setDirty: (dirty: boolean) => void
  ) {
    super(FIELD_PROXY_SYMBOL);
  }

  public focus = () => {
    (this.ref as any)?.focus?.();
    this._setFocused(true);
  };

  public isInitialized = false;
}
