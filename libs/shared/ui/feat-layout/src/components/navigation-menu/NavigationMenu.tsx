"use client";

import {
  Button,
  ButtonGlowTypes,
  ButtonVariants,
  PropsWithBase,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import React from "react";
import Logo from "../../../../../../../assets/box-logo-white.svg";
import { NavigationMenuButton } from "../navigation-menu-button/NavigationMenuButton";
import {
  NavigationMenuItem,
  NavigationMenuItemProps,
} from "../navigation-menu-item/NavigationMenuItem";

export type NavigationMenuProps = PropsWithBase<{
  items: NavigationMenuItemProps[];
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
export function NavigationMenu({ items, ...props }: NavigationMenuProps) {
  const [opened, setOpened] = useCycle(false, true);
  const onClick = React.useCallback(() => {
    setOpened();
  }, [setOpened]);

  return (
    <motion.div
      className="z-nav flex h-full w-full flex-row-reverse"
      initial={false}
      animate={opened ? "opened" : "closed"}>
      <motion.div
        className="from-bg-nav-1 via-bg-nav-1/80 fixed left-0 right-0 bg-gradient-to-b to-slate-900 px-4"
        variants={navMenu}>
        <div
          className="animate-wave1 absolute -top-24 h-28 w-[400%] bg-repeat-x opacity-90"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="animate-wave2 absolute -top-24 h-28 w-[400%] bg-repeat-x opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="animate-wave3 absolute -top-20 h-28 w-[400%] bg-repeat-x opacity-50"
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
                  transition={{ delay: 2 }}>
                  <NavigationMenuItem {...item} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {opened && (
            <motion.div
              className="fixed bottom-0 flex w-full items-center justify-center pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <Link className="mr-16 h-fit w-fit">
                <Logo className="h-[14rem] w-96" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {opened && (
          <>
            <div className="animate-bubble absolute -bottom-14 h-10 w-10 rounded-full bg-white opacity-40" />
            <div className="animate-bubble absolute -bottom-12 left-[40%] h-3 w-3 rounded-full bg-white opacity-10 duration-[5s]" />
            <div className="animate-bubble absolute -bottom-10 left-[50%] h-12 w-12 rounded-full bg-white opacity-50 duration-[20s]" />
            <div className="animate-bubble absolute -bottom-16 left-[70%] h-4 w-4 rounded-full bg-white opacity-20 duration-[8s]" />
            <div className="animate-bubble absolute -bottom-20 left-[10%] h-20 w-20 rounded-full bg-white opacity-60 delay-[2s] duration-[20s]" />
            <div className="animate-bubble absolute -bottom-28 left-[30%] h-12 w-12 rounded-full bg-white opacity-10 delay-[2s] duration-[5s]" />
            <div className="animate-bubble absolute -bottom-36 left-[50%] h-8 w-8 rounded-full bg-white opacity-30 delay-[2s]" />
            <div className="animate-bubble absolute -bottom-24 left-[70%] h-6 w-6 rounded-full bg-white opacity-20 delay-[2s] duration-[8s]" />
            <div className="animate-bubble absolute -bottom-48 left-[20%] h-6 w-6 rounded-full bg-white opacity-10 delay-[4s] duration-[5s]" />
            <div className="animate-bubble absolute -bottom-52 left-[60%] h-12 w-12 rounded-full bg-white opacity-30 delay-[4s]" />
            <div className="animate-bubble absolute -bottom-44 left-[70%] h-4 w-4 rounded-full bg-white opacity-20 delay-[4s] duration-[8s]" />
            <div className="animate-bubble absolute -bottom-56 left-[80%] h-16 w-16 rounded-full bg-white opacity-60 delay-[4s] duration-[20s]" />
          </>
        )}
      </motion.div>

      <motion.div
        className="z-nav-buttons absolute flex flex-row gap-6 px-5 pt-5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0,
          ease: [0, 0.71, 0.2, 1.01],
        }}>
        <Link href="/about">
          <Button
            variant={ButtonVariants.PRIMARY}
            glowType={ButtonGlowTypes.ALWAYS}
            inverse={true}
            hoverText="Let's talk">
            Contact
          </Button>
        </Link>

        <NavigationMenuButton opened={opened} onClick={onClick} />
      </motion.div>
    </motion.div>
  );
}
