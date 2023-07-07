"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
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
          "flex flex-row items-center justify-between gap-20",
          className
        )}>
        <div className="flex flex-row items-center gap-8">
          <div
            className={clsx(
              "flex flex-col gap-2",
              { "basis-3/5": !isWide },
              { "basis-1/2": isWide }
            )}>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0 }}
              className="font-header-4 text-2xl text-violet-500">
              {title}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.25 }}
              className="font-label-4 text-4xl text-primary">
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
