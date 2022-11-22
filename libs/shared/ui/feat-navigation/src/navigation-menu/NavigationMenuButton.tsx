"use client";

import { ButtonVariants } from "@open-system/design-system-components/collection/os-button/os-button.types";
import { OsButton, PropsWithBase } from "@open-system/shared-ui-components";
import { motion } from "framer-motion";

export type NavigationMenuButtonProps = PropsWithBase<{
  opened: boolean;
  onClick: () => void;
}>;

export const NavigationMenuButton = ({
  opened = false,
  onClick,
  ...props
}: NavigationMenuButtonProps) => (
  <motion.div
    className="inline px-4 pt-6"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.8,
      delay: 0.5,
      ease: [0, 0.71, 0.2, 1.01],
    }}>
    <OsButton
      onClick={onClick}
      variant={ButtonVariants.GRADIENT}
      suppressHydrationWarning={true}>
      <svg width="23" height="23" viewBox="0 0 23 23">
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
      <div slot="hover-text">{!opened ? "Open" : "Close"}</div>
    </OsButton>
  </motion.div>
);
