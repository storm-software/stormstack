"use client";

import {
  BaseComponentProps,
  SuccessIcon
} from "@stormstack/design-system-components";
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
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-center">
        <SuccessIcon className="h-96 w-96" />
      </div>
      <div className="flex justify-center">
        <motion.h2
          className="w-fit text-4xl text-primary text-center font-label-4"
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
            className="w-2/3 text-lg text-slate-400 text-center font-body-1">
            {note}
          </motion.p>
        </div>
      )}
    </div>
  );
}
