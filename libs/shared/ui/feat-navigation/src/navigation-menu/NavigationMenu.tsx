/* eslint-disable @typescript-eslint/no-empty-function */
"use client";

import { ButtonVariants } from "@open-system/design-system-components/collection/os-button/os-button.types";
import { OsButton, PropsWithBase } from "@open-system/shared-ui-components";
import { motion, useCycle } from "framer-motion";
import NextLink from "next/link";
import { useEffect, useRef } from "react";
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
  opened: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
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
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
  }, []);

  return dimensions.current;
};

/**
 * A component to facilitate application navigation. It is rendered with
 * a fixed position at the top of the page.
 */
export function NavigationMenu({ items, ...props }: NavigationMenuProps) {
  const [opened, setOpened] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  const onClick = () => {
    console.log("click NavigationMenu");
    setOpened();
  };
  return (
    <motion.div
      className="flex flex-row-reverse px-4"
      initial={false}
      animate={opened ? "opened" : "closed"}
      custom={height}
      ref={containerRef}>
      <motion.div
        className="h-full w-fit border border-slate-800 py-4 shadow-xl backdrop-blur-md"
        variants={navMenu}
      />

      <motion.div className="flex flex-col gap-4" variants={navMenuItems}>
        {opened &&
          items.map((item: NavigationMenuItem, i: number) => (
            <motion.div key={i} variants={navMenuItemList}>
              <Link href={item.href}>{item.name}</Link>
            </motion.div>
          ))}
      </motion.div>

      <motion.div
        className="flex flex-row gap-6 pt-5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.8,
          ease: [0, 0.71, 0.2, 1.01],
        }}>
        <NextLink href="/contact">
          <OsButton
            onClick={() => {}}
            variant={ButtonVariants.PRIMARY}
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
