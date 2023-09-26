"use client";

import {
  BaseComponentProps,
  Button,
  ButtonCornerRoundingTypes,
  ButtonGlowTypes,
  ButtonVariants,
  PropsWithBase
} from "@stormstack/design-system-components";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ReactElement, useCallback, useState } from "react";
import { BoxLogo } from "../box-logo";
import { ColorSchemeTypes } from "../types";
import { NavigationMenuButton } from "./navigation-menu-button/NavigationMenuButton";
import {
  NavigationMenuItem,
  NavigationMenuItemProps
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
      restDelta: 2
    }
  },
  closed: {
    height: 0,
    bottom: "-20%",
    transition: {
      duration: 2.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
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
      className="h-full w-full z-nav flex flex-row-reverse"
      initial={false}
      animate={opened ? "opened" : "closed"}>
      <motion.div
        className="left-0 right-0 bg-gradient-to-b from-bg-nav-1 via-bg-nav-1/80 to-slate-900 px-4 fixed"
        variants={navMenu}>
        <div
          className="-top-24 h-28 opacity-90 absolute w-[400%] animate-wave1 bg-repeat-x"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")"
          }}
        />
        <div
          className="-top-24 h-28 opacity-50 absolute w-[400%] animate-wave2 bg-repeat-x"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")"
          }}
        />
        <div
          className="-top-20 h-28 opacity-50 absolute w-[400%] animate-wave3 bg-repeat-x"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")"
          }}
        />

        <div className="gap-4 py-4 flex flex-col">
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
              className="bottom-0 left-0 right-0 px-6 pb-4 fixed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5
              }}>
              {footer ? (
                footer
              ) : (
                <Link href="/" className="mr-16 h-fit w-fit">
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
          <div className="bottom-0 left-0 w-full absolute animate-bubble">
            <div className="-bottom-14 h-10 w-10 rounded-full bg-white opacity-50 absolute" />
            <div className="-bottom-12 h-3 w-3 rounded-full bg-white opacity-50 absolute left-[40%]" />
            <div className="-bottom-10 h-12 w-12 rounded-full bg-white opacity-50 absolute left-[50%]" />
            <div className="-bottom-16 h-4 w-4 rounded-full bg-white opacity-60 absolute left-[70%]" />
            <div className="-bottom-20 h-20 w-20 rounded-full bg-white opacity-60 absolute left-[10%]" />
            <div className="-bottom-28 h-12 w-12 rounded-full bg-white opacity-50 absolute left-[30%]" />
            <div className="-bottom-36 h-8 w-8 rounded-full bg-white opacity-50 absolute left-[50%]" />
            <div className="-bottom-24 h-6 w-6 rounded-full bg-white opacity-70 absolute left-[70%]" />
            <div className="-bottom-48 h-6 w-6 rounded-full bg-white opacity-60 absolute left-[20%]" />
            <div className="-bottom-52 h-12 w-12 rounded-full bg-white opacity-50 absolute left-[60%]" />
            <div className="-bottom-44 h-4 w-4 rounded-full bg-white opacity-60 absolute left-[70%]" />
            <div className="-bottom-56 h-16 w-16 rounded-full bg-white opacity-60 absolute left-[80%]" />
          </div>
        )}
      </motion.div>

      <div className="gap-6 px-8 pt-5 absolute z-nav-buttons flex flex-row">
        <Link href="/contact" prefetch={true}>
          <Button
            className="w-8"
            variant={ButtonVariants.GRADIENT}
            glowType={ButtonGlowTypes.ALWAYS}
            rounding={ButtonCornerRoundingTypes.FULL}
            hoverText="Let's talk">
            Contact
          </Button>
        </Link>

        <NavigationMenuButton opened={opened} onClick={onClick} />
      </div>
    </motion.div>
  );
}
