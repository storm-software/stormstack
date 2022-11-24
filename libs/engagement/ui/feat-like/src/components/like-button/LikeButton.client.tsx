"use client";

import { PropsWithBase } from "@open-system/shared-ui-components";
import { motion } from "framer-motion";
import PlusIcon from "../../../../../../../assets/heart-plus.svg";

export type LikeButtonClientProps = PropsWithBase<{
  count: number;
}>;

export function LikeButtonClient({
  count = 0,
  ...props
}: LikeButtonClientProps) {
  return (
    <motion.div
      className="bg-secondary bg-[length:100%_30%] bg-bottom bg-no-repeat"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}>
      <div className="flex flex-col">
        <PlusIcon />
        <div className="p-8 py-4">
          <h1>{count} Likes</h1>
        </div>
      </div>
    </motion.div>
  );
}
