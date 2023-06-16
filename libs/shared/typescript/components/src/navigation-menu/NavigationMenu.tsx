"use client";

import { Link } from "@open-system/core-components";
import {
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonGlowTypes,
  ButtonVariants,
  PropsWithBase,
} from "@open-system/design-system-components";
import { AnimatePresence, motion } from "framer-motion";
import { ReactElement, useCallback, useState } from "react";
import { BoxLogo } from "../box-logo";
import { ColorSchemeTypes } from "../types";
import { NavigationMenuButton } from "./navigation-menu-button/NavigationMenuButton";
import {
  NavigationMenuItem,
  NavigationMenuItemProps,
} from "./navigation-menu-item/NavigationMenuItem";

export type NavigationMenuProps = PropsWithBase<{
  items: NavigationMenuItemProps[];
  footer?: ReactElement<BaseComponentProps>;
}>;

const navMenu = {
  opened: {
    height: "80%",
    bottom: 0,
    transition: {
      duration: 10,
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    height: 0,
    bottom: "-20%",
    transition: {
      duration: 2.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

/**
 * A component to facilitate application navigation. It is rendered with
 * a fixed position at the top of the page.
 */
export function NavigationMenu({
  items,
  footer,
  ...props
}: NavigationMenuProps) {
  const [opened, setOpened] = useState(false);
  const onClick = useCallback(() => {
    setOpened(!opened);
  }, [setOpened, opened]);

  return (
    <motion.div
      className="z-nav flex h-full w-full flex-row-reverse"
      initial={false}
      animate={opened ? "opened" : "closed"}>
      <motion.div
        className="fixed left-0 right-0 bg-gradient-to-b from-bg-nav-1 via-bg-nav-1/80 to-slate-900 px-4"
        variants={navMenu}>
        <div
          className="absolute -top-24 h-28 w-[400%] animate-wave1 bg-repeat-x opacity-90"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="absolute -top-24 h-28 w-[400%] animate-wave2 bg-repeat-x opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="absolute -top-20 h-28 w-[400%] animate-wave3 bg-repeat-x opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="flex flex-col gap-4 py-4">
          <AnimatePresence>
            {opened &&
              items.map((item: NavigationMenuItemProps, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 2 + i * 0.5 }}>
                  <NavigationMenuItem {...item} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {opened && (
            <motion.div
              className="fixed bottom-0 left-0 right-0 px-6 pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
              }}>
              {footer ? (
                footer
              ) : (
                <Link className="mr-16 h-fit w-fit">
                  <BoxLogo
                    className="h-[14rem]"
                    colorScheme={ColorSchemeTypes.LIGHT}
                  />
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {opened && (
          <div className="absolute bottom-0 left-0 w-full animate-bubble">
            <div className="absolute -bottom-14 h-10 w-10 rounded-full bg-white opacity-50" />
            <div className="absolute -bottom-12 left-[40%] h-3 w-3 rounded-full bg-white opacity-50" />
            <div className="absolute -bottom-10 left-[50%] h-12 w-12 rounded-full bg-white opacity-50" />
            <div className="absolute -bottom-16 left-[70%] h-4 w-4 rounded-full bg-white opacity-60" />
            <div className="absolute -bottom-20 left-[10%] h-20 w-20 rounded-full bg-white opacity-60" />
            <div className="absolute -bottom-28 left-[30%] h-12 w-12 rounded-full bg-white opacity-50" />
            <div className="absolute -bottom-36 left-[50%] h-8 w-8 rounded-full bg-white opacity-50" />
            <div className="absolute -bottom-24 left-[70%] h-6 w-6 rounded-full bg-white opacity-70" />
            <div className="absolute -bottom-48 left-[20%] h-6 w-6 rounded-full bg-white opacity-60" />
            <div className="absolute -bottom-52 left-[60%] h-12 w-12 rounded-full bg-white opacity-50" />
            <div className="absolute -bottom-44 left-[70%] h-4 w-4 rounded-full bg-white opacity-60" />
            <div className="absolute -bottom-56 left-[80%] h-16 w-16 rounded-full bg-white opacity-60" />
          </div>
        )}
      </motion.div>

      <div className="absolute z-nav-buttons flex flex-row gap-6 px-8 pt-5">
        <Link href="/contact">
          <Button
            className="w-8"
            variant={ButtonVariants.GRADIENT}
            glowType={ButtonGlowTypes.ALWAYS}
            rounding={ButtonCornerRoundingTypes.FULL}
            hoverText="Let's talk">
            Contact
          </Button>
          {/*<span className="pointer-events-none absolute opacity-100 -top-1/2 left-1/2 -z-10 block w-[113%] -translate-x-1/2" aria-hidden="true"><svg className="ml-[50%] -translate-x-1/2 -mt-[2%] h-[130px] w-[110%]" width="300" height="150" viewBox="0 0 300 150" preserveAspectRatio="none" fill="none"><g opacity="0.6" filter="url(#filter0_f_103_7)"><path d="M30.1987 61.1842C30.1987 43.7436 44.3371 29.6052 61.7777 29.6052H238.212C255.652 29.6052 269.791 43.7436 269.791 61.1842C269.791 93.8853 243.281 120.395 210.58 120.395H89.4092C56.7082 120.395 30.1987 93.8853 30.1987 61.1842Z" fill="url(#:rf:)"></path><path d="M30.6924 61.1842C30.6924 44.0161 44.6098 30.0986 61.7779 30.0986H238.212C255.38 30.0986 269.297 44.0161 269.297 61.1842C269.297 93.6127 243.009 119.901 210.58 119.901H89.4094C56.9809 119.901 30.6924 93.6127 30.6924 61.1842Z" stroke="#0C0D0D"></path></g><defs><filter id="filter0_f_103_7" x="0.192383" y="-0.401367" width="299.605" height="150.803" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_103_7"></feGaussianBlur></filter><linearGradient id=":rf:" x1="154.432" y1="29.6052" x2="154.432" y2="145.614" gradientUnits="userSpaceOnUse"><stop offset="0.789474" stopColor="var(--accentColor)"></stop><stop offset="1" stopColor="var(--accentColor)" stopOpacity="0"></stop></linearGradient></defs></svg><svg width="100%" height="150" fill="none" className="absolute top-0"><defs><pattern id="linePattern" patternUnits="userSpaceOnUse" width="200" height="2"><line x1="0" y1="0" x2="300" y2="0" stroke="#0C0D0D" stroke-width="1"></line><line x1="0" y1="2" x2="300" y2="2" stroke="#0C0D0D" stroke-width="1"></line></pattern></defs><g className="button-line-animation"><rect width="100%" height="150" y="-1" fill="url(#linePattern)"></rect><rect width="100%" height="150" y="150" fill="url(#linePattern)"></rect></g></svg></span>*/}

        </Link>
        <NavigationMenuButton opened={opened} onClick={onClick} />
      </div>
    </motion.div>
  );
}
