"use client";

import {
  BaseComponentProps,
  SuccessIcon,
} from "@open-system/design-system-components";
import { motion } from "framer-motion";

export type SuccessContactFormProps = BaseComponentProps & {
  title: string;
  note: string;
};

export function SuccessContactForm({
  className,
  children,
  title,
  note,
  ...props
}: SuccessContactFormProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex justify-center">
        <SuccessIcon className="h-96 w-96" />
      </div>
      <div className="flex justify-center">
        <motion.h2
          className="w-fit text-center font-label-4 text-4xl text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2, ease: "easeInOut" }}>
          {title}
        </motion.h2>
      </div>
      {note && (
        <div className="mt-2 flex justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3, ease: "easeInOut" }}
            className="w-2/3 text-center text-lg font-body-1 text-slate-400">
            {note}
          </motion.p>
        </div>
      )}
    </div>
  );
}
