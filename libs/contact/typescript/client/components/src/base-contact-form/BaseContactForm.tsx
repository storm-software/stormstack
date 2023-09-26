"use client";

import { BaseComponentProps } from "@stormstack/design-system-components";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export type BaseContactFormProps = BaseComponentProps & {
  title: string;
  description: string;
  sideContent?: JSX.Element;
  isWide?: boolean;
};

export function BaseContactForm({
  className,
  children,
  title,
  description,
  sideContent,
  isWide = false,
  ...props
}: BaseContactFormProps) {
  return (
    <AnimatePresence>
      <div
        className={clsx(
          "gap-20 flex flex-row items-center justify-between",
          className
        )}>
        <div className="gap-8 flex flex-row items-center">
          <div
            className={clsx(
              "gap-2 flex flex-col",
              { "basis-3/5": !isWide },
              { "basis-1/2": isWide }
            )}>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0 }}
              className="text-2xl text-violet-500 font-header-4">
              {title}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.25 }}
              className="text-4xl text-primary font-label-4">
              {description}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.25 }}>
              {sideContent}
            </motion.div>
          </div>
          <motion.div
            className={clsx(
              "flex flex-col justify-center",
              { "basis-2/5": !isWide },
              { "basis-1/2": isWide }
            )}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}>
            {children}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
