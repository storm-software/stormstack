"use client";

import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef
} from "react";

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
    document.addEventListener("mousedown", handleClick, true);

    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [handleClick]);

  return ref;
}

export const useClickOutsideFromRef = (
  ref: RefObject<Element>,
  callback: (event: MouseEvent) => void,
  outerRef?: RefObject<Element>
): void => {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (
        outerRef &&
        outerRef.current &&
        !outerRef.current.contains(event.target as Node)
      )
        return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    },
    [callback, ref, outerRef]
  );
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
};
