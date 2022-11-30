/* eslint-disable @typescript-eslint/no-empty-function */
"use client";

import {
  ButtonGlowTypes,
  ButtonVariants,
} from "@open-system/design-system-components/collection/os-button/os-button.types";
import { OsButton } from "@open-system/design-system-components/react";
import { PropsWithBase } from "@open-system/shared-ui-components";
import { motion, useCycle } from "framer-motion";
import NextLink from "next/link";
import { useCallback } from "react";
import { UrlObject } from "url";
import { Link } from "../link";
import { NavigationMenuButton } from "./NavigationMenuButton";
export interface NavigationMenuItem {
  name: string;
  href: string | UrlObject;
}

export type NavigationMenuProps = PropsWithBase<{
  items: NavigationMenuItem[];
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
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const navMenuItems = {
  opened: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const navMenuItemList = {
  opened: {
    opacity: 1,
    transition: {
      delay: 0.5,
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    opacity: 0,
    transition: {
      delay: 0.5,
      y: { stiffness: 1000 },
    },
  },
};

/**
 * A component to facilitate application navigation. It is rendered with
 * a fixed position at the top of the page.
 */
export function NavigationMenu({ items, ...props }: NavigationMenuProps) {
  const [opened, setOpened] = useCycle(false, true);

  const onClick = useCallback(() => {
    console.log("click 2 NavigationMenu");
    setOpened();
  }, [setOpened]);

  return (
    <motion.div
      className="z-nav flex h-full w-full flex-row-reverse"
      initial={false}
      animate={opened ? "opened" : "closed"}>
      <motion.div
        className="from-bg-nav-1 via-bg-nav-1/80 fixed left-0 right-0 bg-gradient-to-b to-slate-800 px-4"
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
          className="absolute -top-24 h-28 w-[400%] animate-wave3 bg-repeat-x opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003F7C'/%3E%3C/svg%3E\")",
          }}
        />

        <motion.div
          className="flex flex-col gap-4 py-4"
          variants={navMenuItems}>
          {opened &&
            items.map((item: NavigationMenuItem, i: number) => (
              <motion.div key={i} variants={navMenuItemList}>
                <Link href={item.href}>{item.name}</Link>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute flex flex-row gap-6 px-5 pt-5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0,
          ease: [0, 0.71, 0.2, 1.01],
        }}>
        <NextLink href="/about">
          <OsButton
            onClick={() => {}}
            variant={ButtonVariants.PRIMARY}
            glowType={ButtonGlowTypes.ALWAYS}
            inverse={true}>
            Contact
            <div slot="hover-text">Let's talk</div>
          </OsButton>
        </NextLink>

        <NavigationMenuButton opened={opened} onClick={onClick} />
      </motion.div>
    </motion.div>
  );
}
