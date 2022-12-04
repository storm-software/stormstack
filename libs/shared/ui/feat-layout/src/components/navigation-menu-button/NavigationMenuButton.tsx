"use client";

import { OsButton } from "@open-system/design-system-components-react";
import {
  ButtonTransitionDirections,
  ButtonVariants,
} from "@open-system/design-system-components/collection/os-button/os-button.types";
import { PropsWithBase } from "@open-system/shared-ui-components";
import { motion } from "framer-motion";

export type NavigationMenuButtonProps = PropsWithBase<{
  opened: boolean;
  onClick: () => void;
}>;

export function NavigationMenuButton({
  opened = false,
  onClick,
  ...props
}: NavigationMenuButtonProps) {
  return (
    <OsButton
      onClick={onClick}
      variant={ButtonVariants.GRADIENT}
      transitionDirection={ButtonTransitionDirections.TOP}
      suppressHydrationWarning={true}>
      <svg width="25" height="25" viewBox="0 0 25 25">
        <motion.path
          fill="transparent"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            opened: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          fill="transparent"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            opened: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <motion.path
          fill="transparent"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            opened: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
    </OsButton>
  );
}
