/* eslint-disable @typescript-eslint/no-explicit-any */
/*import { ThunkDispatch } from "@reduxjs/toolkit";

let initialized = false;
export function setupListeners(
  dispatch: ThunkDispatch<any, any, any>,
  customHandler?: (
    dispatch: ThunkDispatch<any, any, any>,
    actions: {
      onFocus: any;
      onFocusLost: any;
      onOnline: any;
      onOffline: any;
    }
  ) => () => void
) {
  function defaultHandler(
    dispatch: ThunkDispatch<any, any, any>,
    actions: {
      onFocus: any;
      onFocusLost: any;
      onOnline: any;
      onOffline: any;
    }
  ) {
    const handleFocus = () => dispatch(actions.onFocus());
    const handleFocusLost = () => dispatch(actions.onFocusLost());
    const handleOnline = () => dispatch(actions.onOnline());
    const handleOffline = () => dispatch(actions.onOffline());
    const handleVisibilityChange = () => {
      if (window.document.visibilityState === "visible") {
        handleFocus();
      } else {
        handleFocusLost();
      }
    };

    if (!initialized) {
      if (typeof window !== "undefined" && window.addEventListener) {
        // Handle focus events
        window.addEventListener(
          "visibilitychange",
          handleVisibilityChange,
          false
        );
        window.addEventListener("focus", handleFocus, false);

        // Handle connection events
        window.addEventListener("online", handleOnline, false);
        window.addEventListener("offline", handleOffline, false);
        initialized = true;
      }
    }
    const unsubscribe = () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      initialized = false;
    };
    return unsubscribe;
  }

  return customHandler
    ? customHandler(dispatch, { onFocus, onFocusLost, onOffline, onOnline })
    : defaultHandler();
}*/
