"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { useStoreVisit } from "@open-system/user-management-data-access";
import {
  useIsHeaderDisplayedValue,
  useSetIsHeaderDisplayed,
} from "../hooks/useHeaderState";
import { default as DevClient } from "./dev/client";

export default function Client(props: BaseComponentProps) {
  useStoreVisit();
  useSetIsHeaderDisplayed();
  const isAppHeaderDisplayed = useIsHeaderDisplayedValue();

  return <>{!isAppHeaderDisplayed && <DevClient />}</>;
}
