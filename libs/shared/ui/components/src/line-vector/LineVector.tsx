"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { motion } from "framer-motion";
import { MutableRefObject } from "react";

export interface LineVectorProps extends BaseComponentProps {
  width: number;
  strokeWidth: number;
  isHorizontal?: boolean;
  inverseAnimation?: boolean;
}

export function LineVector({
  className,
  containerRef,
  width = 400,
  strokeWidth = 1,
  isHorizontal = false,
  inverseAnimation = false,
}: LineVectorProps) {
  return (
    <div className={className}>
      <svg
        width={width}
        viewBox="0 0 400 400"
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
                duration: 10,
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
                duration: 8,
                repeatType: "reverse",
                repeat: Infinity,
                repeatDelay: 1,
              }}
              offset="100%"
            />
          </linearGradient>
        </defs>
        <motion.path
          d={
            isHorizontal
              ? inverseAnimation
                ? "M1 1 L399 2"
                : "M399 2 L1 1"
              : inverseAnimation
              ? "M1 1 L399 399"
              : "M399 399 L1 1"
          }
          stroke="url(#linear-gradient)"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          fill="transparent"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 399 }}
          viewport={{ root: containerRef, once: true }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
