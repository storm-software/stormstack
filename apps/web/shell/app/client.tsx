"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { motion, Variants } from "framer-motion";
import { useIsHeaderDisplayedValue, useSetIsHeaderDisplayed } from "../hooks/useHeaderState";
import { default as DevClient } from "./dev/client";

export default function Client(props : BaseComponentProps) {
  useSetIsHeaderDisplayed();
  const isAppHeaderDisplayed = useIsHeaderDisplayedValue();


  return (<>
    {!isAppHeaderDisplayed && <DevClient />}
    </>
  );
}
