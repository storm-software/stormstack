"use client";

import { useScroll } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { isHeaderDisplayedAtom } from "../state/header";

export function useIsHeaderDisplayed() {
  return useAtom(isHeaderDisplayedAtom);
}

export function useIsHeaderDisplayedValue() {
  return useAtomValue(isHeaderDisplayedAtom);
}

export function useSetIsHeaderDisplayed() {
  const [isHeaderDisplayed, setIsHeaderDisplayedValue] = useAtom(
    isHeaderDisplayedAtom
  );

  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (scrollY: number) => {
      //console.log(scrollY);
      if (isHeaderDisplayed && scrollY) {
        setIsHeaderDisplayedValue(false);
        // router.push("/dev");
      } else if (!isHeaderDisplayed && !scrollY) {
        setIsHeaderDisplayedValue(true);
        // router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isHeaderDisplayed, scrollYProgress, setIsHeaderDisplayedValue]);

  return setIsHeaderDisplayedValue;
}
