"use client";

import {
  ContactFormProgressStep,
  contactFormProgressAtom,
  useSetContactFormProgress,
} from "@open-system/contact-client-data-access";
import { ProgressTracker } from "@open-system/core-client-components";
import {
  BaseComponentProps,
  ProgressTrackerItemStatus,
} from "@open-system/design-system-components";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export type ContactFormProgressTrackerProps = BaseComponentProps;

export function ContactFormProgressTracker({
  className,
  ...props
}: ContactFormProgressTrackerProps) {
  const items = useAtomValue(contactFormProgressAtom);
  const { goToStep } = useSetContactFormProgress();

  const pathname = usePathname();
  useEffect(() => {
    const current = items.findIndex(
      (item: ContactFormProgressStep) =>
        item.pathname === pathname &&
        item.status !== ProgressTrackerItemStatus.ACTIVE
    );
    current > 0 && goToStep(current);
  }, []);

  return (
    <AnimatePresence>
      {items && items.length > 0 && (
        <motion.div
          className="flex flex-col gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}>
          <ProgressTracker items={items} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
