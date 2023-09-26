"use client";

import { BaseComponentProps } from "@stormstack/design-system-components";
import { useStoreVisit } from "@stormstack/user-management-client-data-access";
import {
  useIsHeaderDisplayedValue,
  useSetIsHeaderDisplayed
} from "../hooks/useHeaderState";
import { default as DevClient } from "./dev/client";

export default function Client(props: BaseComponentProps) {
  useStoreVisit();
  useSetIsHeaderDisplayed();
  const isAppHeaderDisplayed = useIsHeaderDisplayedValue();

  return <>{!isAppHeaderDisplayed && <DevClient />}</>;
}
