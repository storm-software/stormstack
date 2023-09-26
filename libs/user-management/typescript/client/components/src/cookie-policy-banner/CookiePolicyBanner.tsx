"use client";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { Link } from "@stormstack/core-client-components";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonTypes,
  ButtonVariants
} from "@stormstack/design-system-components";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useCallback, useState } from "react";
import Cookie from "../../assets/cookie.svg";

const variants: Variants = {
  opened: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2,
      delay: 10,
      ease: [0, 0.71, 0.2, 1.01]
    }
  },
  closed: {
    opacity: 0,
    y: 300,
    transition: {
      duration: 1,
      delay: 0,
      ease: [0, 0.71, 0.2, 1.01]
    }
  }
};

export function CookiePolicyBanner({
  onAgreeToPrivacyPolicy
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
          className="bottom-0 left-0 right-0 w-full border-t-stone-700 bg-bg-2 fixed z-progress border-t-[6px]"
          initial="closed"
          variants={variants}
          animate={isHidden ? "closed" : "opened"}>
          <div className="h-full w-full gap-6 bg-gradient-to-b from-bg-1 via-bg-1/70 via-50% to-bg-1/40 px-5 py-4 flex flex-row items-center justify-center">
            <div className="w-36 lg:w-32 relative">
              <Cookie className="bottom-0 left-0 h-28 w-28 lg:h-36 lg:w-36 absolute rotate-[15deg]" />
            </div>
            <div className="flex-1 gap-4 md:flex-row flex flex-col items-center justify-center">
              <p className="text-lg text-primary font-body-1">
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
              className="cursor-pointer rounded-full border-2 p-3 font-semibold transition-colors hover:border-slate-400 group">
              <XMarkIcon className="h-6 w-6 cursor-pointer text-primary transition-colors group-hover:text-slate-400" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
