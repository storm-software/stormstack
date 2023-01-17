"use client";

import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonGlowTypes,
  ButtonVariants,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import { motion } from "framer-motion";

export default function HeaderLinks() {
  return (
    <div className="z-bg flex flex-col">
      <motion.div
        className="absolute flex flex-row gap-6 px-8 pt-5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0,
          ease: [0, 0.71, 0.2, 1.01],
        }}>
        <Link href="/about">
          <Button
            variant={ButtonVariants.SECONDARY}
            glowType={ButtonGlowTypes.ALWAYS}
            rounding={ButtonCornerRoundingTypes.NONE}
            inverse={true}
            hoverText="View list">
            Projects
          </Button>
        </Link>
        <Link href="/about">
          <Button
            variant={ButtonVariants.GRADIENT}
            glowType={ButtonGlowTypes.ALWAYS}
            rounding={ButtonCornerRoundingTypes.NONE}
            inverse={true}
            hoverText="View list">
            Projects
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
