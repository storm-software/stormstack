"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { motion } from "framer-motion";

export interface BackgroundLineProps extends BaseComponentProps {
  width: number;
  strokeWidth: number;
}

export default function BackgroundLine({
  className,
  width = 400,
  strokeWidth = 1,
}: BackgroundLineProps) {
  return (
    <div className={className}>
    <svg
      width={width}
      viewBox="0 0 28 2.5"
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
        d="M0.8 1
          L3.47355 2
          L6.13456 1
          L9.5203 2
          L12.1303 1
          L15.7424 2
          L18.2074 1
          L21.6074 2
          L23.8074 1
          L27.1055 2"
        stroke="url(#linear-gradient)"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        fill="transparent"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 5, yoyo: 1, delay: 0, ease: "easeInOut" }}
      />
    </svg>
    </div>
  );
}
