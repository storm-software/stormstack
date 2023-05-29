"use client";

import { useContext } from "react";
import {
  Context,
  AppHeaderState,
  INITIAL_STATE,
} from "../state/app-header-state-context";

export function useAppHeaderState(): AppHeaderState {
  const { isDisplayed } = useContext<AppHeaderState>(Context);

  return { ...INITIAL_STATE, isDisplayed };
}

export function useIsAppHeaderDisplayed(): boolean {
  return !!useAppHeaderState()?.isDisplayed;
}

export default useAppHeaderState;
