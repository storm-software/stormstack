"use client";

import { MutableRefObject, useEffect, useRef } from "react";

export function useClickOutside(
  callbackFn?: () => void
): MutableRefObject<any> {
  const ref = useRef<any>();

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackFn?.();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [callbackFn]);

  return ref;
}
