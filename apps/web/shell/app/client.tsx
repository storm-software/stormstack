"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { motion, Variants } from "framer-motion";
import { useIsAppHeaderDisplayed } from "../hooks/use-app-header-state";
import { default as DevClient } from "./dev/client";

export default function Client(props : BaseComponentProps) {
  const isAppHeaderDisplayed = useIsAppHeaderDisplayed();

  return (<>
    {!isAppHeaderDisplayed && <DevClient />}
    </>
  );
}
