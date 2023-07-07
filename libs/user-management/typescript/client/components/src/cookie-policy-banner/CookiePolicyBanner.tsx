"use client";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { Link } from "@open-system/core-client-components";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants,
} from "@open-system/design-system-components";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useCallback, useState } from "react";
import Cookie from "../../../../../../assets/images/cookie.svg";

const variants: Variants = {
  opened: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2,
      delay: 10,
      ease: [0, 0.71, 0.2, 1.01],
    },
  },
  closed: {
    opacity: 0,
    y: 300,
    transition: {
      duration: 1,
      delay: 0,
      ease: [0, 0.71, 0.2, 1.01],
    },
  },
};

export function CookiePolicyBanner({
  onAgreeToPrivacyPolicy,
}: {
  onAgreeToPrivacyPolicy: () => void;
}) {
  const [isHidden, setIsHidden] = useState(false);

  /*const handleAgreeToPrivacyPolicy = useCallback(() => {
    setIsHidden(true);
  }, [onAgreeToPrivacyPolicy]);*/
  const handleClose = useCallback(() => {
    setIsHidden(true);
  }, []);

  return (
    <form onSubmit={onAgreeToPrivacyPolicy}>
      <AnimatePresence>
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-progress w-full border-t-[6px] border-t-stone-700 bg-bg-2"
          initial="closed"
          variants={variants}
          animate={isHidden ? "closed" : "opened"}>
          <div className="flex h-full w-full flex-row items-center justify-center gap-6 bg-gradient-to-b from-bg-1 via-bg-1/70 via-50% to-bg-1/40 px-5 py-4">
            <div className="relative w-36 lg:w-32">
              <Cookie className="absolute bottom-0 left-0 h-28 w-28 rotate-[15deg] lg:h-36 lg:w-36" />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 md:flex-row">
              <p className="text-lg font-body-1 text-primary">
                This website uses cookies to improve user experience.{" "}
                <b>Your data will never be shared with a third party</b>. Do you
                accept the{" "}
                  <Link
                    variant="primary"
                    className="text-lg font-body-1"
                    inNewTab={true}>
                    cookie policy
                  </Link>
                ?
              </p>

              <div className="md:mx-4">
                <Button
                  type={ButtonTypes.SUBMIT}
                  variant={ButtonVariants.PRIMARY}
                  transitionDirection={ButtonTransitionDirections.NONE}
                  rounding={ButtonCornerRoundingTypes.NONE}
                  inverse={true}>
                  Accept
                </Button>
              </div>
            </div>
            <div
              onClick={handleClose}
              className="group cursor-pointer rounded-full border-2 p-3 font-semibold transition-colors hover:border-slate-400">
              <XMarkIcon className="h-6 w-6 cursor-pointer text-primary transition-colors group-hover:text-slate-400" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
