import { RefObject, useCallback, useRef, useState } from "react";
import { BaseFieldProps, ChangeHandler } from "../types";
import { FieldProxy } from "./field-proxy";

export function useFieldProxy<
  TValue = any,
  TRef extends HTMLInputElement = HTMLInputElement
>(
  ref: RefObject<TRef>,
  { onChange, onFocus, onBlur, ...props }: BaseFieldProps
): [FieldProxy<TValue, TRef>, ChangeHandler, ChangeHandler, () => void] {
  const [label, setLabel] = useState<string | JSX.Element | null>(
    props?.label ?? null
  );
  const [error, setError] = useState<undefined | string | null>(null);
  const [warning, setWarning] = useState<undefined | string | null>(null);
  const [info, setInfo] = useState<undefined | string | null>(
    props?.info ?? null
  );
  const [value, setValue] = useState<any>(props?.value ?? "");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [required, setRequired] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

  const proxy = useRef(
    FieldProxy.create({
      ref,
      value,
      setValue,
      label,
      setLabel,
      error,
      setError,
      warning,
      setWarning,
      info,
      setInfo,
      disabled,
      setDisabled,
      focused,
      setFocused,
      required,
      setRequired,
      dirty,
      setDirty,
    }) as FieldProxy<TValue, TRef>
  );

  const handleChanged = useCallback(
    async (event: { target: any; type?: any }) => {
      const nextValue = event?.target?.value ?? null;
      if (nextValue !== value) {
        setValue(nextValue as any);
        onChange?.(event);
        proxy.current.value = nextValue;
      }
    },
    [onChange, value]
  );

  const handleFocus = useCallback(async () => {
    setFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(
    async (event: { target: any; type?: any }) => {
      setFocused(false);
      onBlur?.(event);
    },
    [onBlur]
  );

  return [proxy.current, handleChanged, handleBlur, handleFocus];
}
