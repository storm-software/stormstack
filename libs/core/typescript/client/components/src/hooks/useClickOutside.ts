"use client";

import { MutableRefObject, useEffect, useCallback, useRef } from "react";

export function useClickOutside(
  callbackFn?: () => void
): MutableRefObject<any> {
  const ref = useRef<any>();

  const handleClick = useCallback(
    (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackFn?.();
        event.stopPropagation();
      }
    },
    [callbackFn]
  );
  useEffect(() => {
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [handleClick]);

  return ref;
}
