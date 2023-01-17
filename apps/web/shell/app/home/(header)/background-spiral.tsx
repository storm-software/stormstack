"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { motion } from "framer-motion";

export interface BackgroundSpiralProps extends BaseComponentProps {
  width: number;
  strokeWidth: number;
}

export default function BackgroundSpiral({
  width = 400,
  strokeWidth = 2,
}: BackgroundSpiralProps) {
  return (
    <div className="z-bg flex flex-col">
      <svg
        width={width}
        height={width}
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <motion.stop
              stopColor="#14b8a6"
              animate={{
                stopColor: ["#8b5cf6", "#0284c7", "#14b8a6"],
              }}
              transition={{
                yoyo: Infinity,
                ease: "linear",
                duration: 12,
                repeatType: "reverse",
                repeat: Infinity,
                repeatDelay: 1,
              }}
              offset="0%"
            />
            <motion.stop
              stopColor="#8b5cf6"
              animate={{
                stopColor: ["#14b8a6", "#0284c7", "#8b5cf6"],
              }}
              transition={{
                yoyo: Infinity,
                ease: "linear",
                duration: 5,
                repeatType: "reverse",
                repeat: Infinity,
                repeatDelay: 1,
              }}
              offset="100%"
            />
          </linearGradient>
        </defs>
        <motion.path
          d="m351 487c0 8-11 4-14-1-6-11 4-24 15-27 19-5 37 11 40 30 4 27-18 50-44 53-35 4-64-25-66-59-3-42 32-77 73-79 50-3 90 39 92 88 2 57-46 104-102 105-65 2-117-53-119-117-1-72 60-131 131-132 80-1 144 67 145 146 1 87-74 158-160 158-95 0-171-81-171-175 0-102 88-185 190-184 110 1 198 95 197 204C557 615 456 709 340 708 215 706 115 598 117 475 119 342 233 236 364 238 504 240 616 361 614 500 611 648 484 766 337 763 182 760 58 626 61 472 65 309 206 179 367 183c170 4 306 151 302 320-4 178-158 319-335 315"
          stroke="url(#linear-gradient)"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          fill="transparent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, yoyo: 1, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
