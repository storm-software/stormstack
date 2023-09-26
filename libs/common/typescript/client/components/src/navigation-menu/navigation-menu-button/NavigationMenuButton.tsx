"use client";

import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonVariants,
  PropsWithBase
} from "@stormstack/design-system-components";
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
    <Button
      onClick={onClick}
      className="h-5 w-5"
      variant={ButtonVariants.GRADIENT}
      transitionDirection={ButtonTransitionDirections.NONE}
      rounding={ButtonCornerRoundingTypes.FULL}
      noPadding={true}
      suppressHydrationWarning={true}>
      <div className="ml-1 mt-1">
        <svg width="30" height="30" viewBox="0 0 25 25">
          <motion.path
            fill="transparent"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              opened: { d: "M 3 16.5 L 17 2.5" }
            }}
          />
          <motion.path
            className="stroke-secondary"
            fill="transparent"
            strokeWidth="3"
            strokeLinecap="round"
            d="M 10 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              opened: { opacity: 0 }
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
              opened: { d: "M 3 2.5 L 17 16.346" }
            }}
          />
        </svg>
      </div>
    </Button>
  );
}
