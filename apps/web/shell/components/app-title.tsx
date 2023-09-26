"use client";

import { Heading } from "@stormstack/design-system-components";
import { BoxLogo } from "@stormstack/common-client-components";
import clsx from "clsx";
import { motion, Variants } from "framer-motion";
import { useIsHeaderDisplayedValue } from "../hooks/useHeaderState";

const container: Variants = {
  opened: {
    y: 200,
    transition: {
      duration: 1,
      stiffness: 1000,
      velocity: -100
    }
  },
  closed: {
    y: 0,
    transition: {
      duration: 1,
      stiffness: 1000
    }
  }
};

const wrapper: Variants = {
  opened: {
    height: 300,
    transition: {
      duration: 1,
      stiffness: 1000,
      velocity: -100
    }
  },
  closed: {
    height: 500,
    transition: {
      duration: 1,
      stiffness: 1000
    }
  }
};

export default function AppTitle() {
  const isAppHeaderDisplayed = useIsHeaderDisplayedValue();

  return (
    <motion.div
      className="left-0 right-0 w-full absolute flex flex-col"
      variants={container}
      initial={false}
      animate={isAppHeaderDisplayed ? "closed" : "opened"}>
      <motion.div
        className="w-full relative flex flex-row items-center justify-center"
        variants={wrapper}
        initial={false}
        animate={isAppHeaderDisplayed ? "closed" : "opened"}>
        <div
          className={clsx(
            { "title-text h-[24rem]": isAppHeaderDisplayed },
            { "h-[21rem]": !isAppHeaderDisplayed },
            "h-fit w-fit grid-cols-1 grid"
          )}>
          <h1
            id="title-text-1"
            className={clsx(
              { "text-8xl": isAppHeaderDisplayed },
              { "text-7xl": !isAppHeaderDisplayed },
              "col-start-1 row-start-1 leading-none text-primary transition-all whitespace-pre font-header-1"
            )}>
            Pat Sullivan
            <br />
            <span className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to text-transparent bg-clip-text">
              Development
            </span>
          </h1>
          {isAppHeaderDisplayed && (
            <>
              <h1
                id="title-text-2"
                className="col-start-1 row-start-1 text-8xl leading-none text-primary transition-all whitespace-pre font-header-1">
                Pat Sullivan
                <br />
                <span className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to text-transparent bg-clip-text">
                  Development
                </span>
              </h1>
              <h1
                id="title-text-3"
                className="col-start-1 row-start-1 text-8xl leading-none text-primary transition-all whitespace-pre font-header-1">
                Pat Sullivan
                <br />
                <span className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to text-transparent bg-clip-text">
                  Development
                </span>
              </h1>
            </>
          )}
        </div>

        <div className="w-fit">
          <BoxLogo
            className={clsx(
              { "w-full h-[29rem]": isAppHeaderDisplayed },
              { "w-full h-[20rem]": !isAppHeaderDisplayed },
              "transition-all delay-300 animate-flicker"
            )}
          />
        </div>
      </motion.div>

      <div
        className={clsx(
          { "opacity-100 flex flex-row": isAppHeaderDisplayed },
          { "opacity-0 hidden": !isAppHeaderDisplayed },
          "transition-opacity justify-center"
        )}>
        <div className="align-center animate-flicker-2">
          <Heading
            level={4}
            className="text-border text-5xl leading-none text-white text-center">
            Software designed for{" "}
            <span className="text-glow-purple bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to text-transparent bg-clip-text">
              tomorrow&apos;s
            </span>{" "}
            brands
          </Heading>
          {/*<div className="flex flex-row justify-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              width="50%"
              fill="#FFF"
              preserveAspectRatio="none">
              <path
                d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"
                strokeLinecap="round"
                strokeWidth={4}
              />
            </svg>
        </div>*/}
        </div>
      </div>
    </motion.div>
  );
}
