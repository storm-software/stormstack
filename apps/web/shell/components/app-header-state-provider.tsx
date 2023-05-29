"use client";

import { useScroll } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  ContextProvider,
  INITIAL_STATE,
} from "../state/app-header-state-context";

export default function AppHeaderStateProvider(props: { children: ReactNode }) {
  // const router = useRouter();
  const [isDisplayed, setIsDisplayed] = useState<boolean>(
    INITIAL_STATE.isDisplayed
  );

  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (scrollY: number) => {
      //console.log(scrollY);
      if (isDisplayed && scrollY) {
        setIsDisplayed(false);
        // router.push("/dev");
      } else if (!isDisplayed && !scrollY) {
        setIsDisplayed(true);
        // router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isDisplayed, scrollYProgress]);

  return (
    <ContextProvider value={{ ...INITIAL_STATE, isDisplayed }}>
      {props.children}
    </ContextProvider>
  );
}
