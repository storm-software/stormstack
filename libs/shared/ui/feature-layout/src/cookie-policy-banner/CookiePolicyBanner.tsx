"use client";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonTransitionDirections,
  ButtonVariants,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import {
  agreeToPrivacyPolicy,
  selectHasAgreedToPrivacyPolicy,
} from "@open-system/shared-ui-data-access";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookie from "../../assets/cookie-icon.svg";

const variants = {
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

export function CookiePolicyBanner() {
  const [isHidden, setIsHidden] = useState(false);

  const dispatch = useDispatch();
  const handleAgree = useCallback(() => {
    dispatch(agreeToPrivacyPolicy());

    // await service.updateUserData({ hasAgreedToCookiePolicy: true });

    setIsHidden(true);
  }, [dispatch]);

  const handleClose = useCallback(() => {
    setIsHidden(true);
  }, []);

  const hasAgreedToPrivacyPolicy = useSelector(selectHasAgreedToPrivacyPolicy);
  if (hasAgreedToPrivacyPolicy) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-progress w-full border-t-[6px] border-t-stone-700 backdrop-blur-xl"
        initial="closed"
        variants={variants}
        animate={isHidden ? "closed" : "opened"}>
        <div className="flex h-full w-full flex-row items-center justify-center gap-6 px-5 py-8 pb-12">
          <div className="relative w-36 lg:w-32">
            <Cookie className="absolute left-0 bottom-0 h-28 w-28 rotate-[40deg] lg:h-36 lg:w-36" />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 md:flex-row">
            <label className="text-lg font-body-1 text-primary">
              This website uses cookies to improve user experience.{" "}
              <b>Your data will never be shared with a third party</b>. Do you
              accept the <Link>cookie policy</Link>?
            </label>

            <div className="md:mx-4">
              <Button
                onClick={handleAgree}
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
  );
}
